import type { TableLookupChannel, TableUser, TableUserChannel } from '../interfaces';
import { Client, GatewayIntentBits } from 'discord.js';
import { UpdateActivity } from '../utils';
import Commands from './commands';
import tn from '../constants';
import User from '../express/User';
import db from '../db';
import logger from '../logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const client = new Client({
  closeTimeout: 300000, // 5min
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
});

client.once('ready', async () => {
  logger.info(`Logged in as ${client.user?.tag}`);
  UpdateActivity(client, '📀');
});

client.on('messageCreate', async (message) => {
  const RegexURL = new RegExp(
    /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/g
  );
  if (message.content.match(RegexURL)) {
    try {
      const messageURL = new URL(message.content);
      if (
        messageURL.host === 'open.spotify.com' &&
        messageURL.pathname.split('/')[1] === 'track'
      ) {
        // TODO: Use a global variable updated after /channel add/delete command instead of db query or create a role that can only access certains channels
        const queryChannel = await db
          .select<TableLookupChannel<'s'>>('*')
          .from(tn.lookup_channel)
          .where('channel_id', message.channelId)
          .first();

        if (queryChannel) {
          const registeredUsers = await db
            .select<TableUserChannel<'s'>[]>('*')
            .from(tn.user_channel)
            .where('channel_id', message.channelId);

          if (registeredUsers) {
            registeredUsers.forEach(async (user) => {
              const userDb: TableUser<'s'> = await db
                .select('*')
                .from(tn.user)
                .where('id', user.user_id)
                .first();

              const profile = new User(userDb.spotify_id);
              await profile.getUser();

              // TODO: Configurer les playlists -> channel discord sur le site
              const user_playlist = (await profile.getUserPlaylist())[0];

              // TODO: Create SpotifyURI parser
              await profile.addItemsToPlaylist(user_playlist.playlist_id, [
                `spotify:track:${messageURL.pathname.split('/track/')[1]}`,
              ]);
            });
            message.react('👍');
          }
        }
      }
    } catch (error) {
      // not valid url
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = Commands[interaction.commandName];
  try {
    command.execute(interaction);
  } catch (error) {
    // TODO: Report error
    logger.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('shardDisconnect', async (event) => {
  setTimeout(() => {
    client.destroy();
    client.login(process.env.DISCORD_TOKEN);
  }, 300000); // 5min
  logger.warn('Bot disconnected!', event);
});

client.on('shardError', async (error) => { logger.warn('Bot error:', error); });
client.on('shardReconnecting', async (event) => { logger.warn('Shard reconnecting!', event); });
client.on('shardResume', async (event) => { logger.warn('Shard resuming!', event); });
client.on('shardReady', async (event) => { logger.warn('Shard ready!', event); });

client.on('channelDelete', async (channel) => {
  const dbQuery = await db
    .del()
    .from(tn.lookup_channel)
    .where('channel_id', channel.id);
  if (dbQuery) logger.info(`channel: ${channel.id} deleted: ${dbQuery}`);
  // TODO: Remove entry of user_channel as well
});

client.login(process.env.DISCORD_TOKEN);
