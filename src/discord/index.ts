import type { TableUser, TableUserChannel } from '../interfaces';
import { Client, GatewayIntentBits } from 'discord.js';
import { UpdateActivity } from '../utils';
import Commands from './commands';
import tn from '../constants';
import User from '../express/User';
import db from '../db';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const client = new Client({
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
  console.log(`Logged in as ${client.user?.tag}`);
  UpdateActivity(client, '📀');
});

client.on('messageCreate', async (message) => {
  const RegexURL = new RegExp(/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/);
  if (message.content.match(RegexURL)) {
    const messageURL = new URL(message.content);
    if (messageURL.host === 'open.spotify.com'
      && messageURL.pathname.split('/')[1] === 'track') {
      // TODO: Use a global variable updated after /channel add/delete command instead of db query or create a role that can only access certains channels
      const queryChannel = await db
        .select<TableUserChannel<'s'>>('*')
        .from(tn.lookup_channel)
        .where('channel_id', message.channelId)
        .first();
      if (queryChannel) {
        // TODO: Optimization reuse the query made 11 line above
        const registeredUsers = await db
          .select<TableUserChannel<'s'>[]>('*')
          .from(tn.user_channel)
          .where('channel_id', message.channelId);

        if (registeredUsers) {
          console.log(registeredUsers);
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
            await profile.addItemsToPlaylist(user_playlist.playlist_id, [`spotify:track:${messageURL.pathname.split('/track/')[1]}`]);
          });
          message.react('👍');
        }
      }
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
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('disconnect', async () => {
  client.destroy().then(()=>client.login(process.env.DISCORD_TOKEN));
});

// TODO: compare with channel in db
// client.on('channelDelete', async (channel) => {
//   console.log(channel);
// });

client.login(process.env.DISCORD_TOKEN);
