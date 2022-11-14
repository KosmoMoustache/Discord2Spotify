import {
  Client,
  Collection,
  GatewayIntentBits,
  PermissionsBitField,
} from 'discord.js';
import type { TableLookupChannel } from '../interfaces';
import { UpdateActivity } from '../utils';
import CooldownManager, {
  CooldownData,
  cooldownRules,
} from './cooldownManager';
import { processMessage } from './processMessage';
import LookupChannel from './lookupChannel';
import Commands from './commands';
import logger from '../logger';
import i18n from '../constants/i18n';
import db from '../db';
import tn from '../constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const cd = new CooldownManager();

const lookup_channel: Array<string | null> = [];
(async () => {
  const t_channel_ids = await db
    .select<Pick<TableLookupChannel<'s'>, 'channel_id'>[]>('channel_id')
    .from(tn.lookup_channel);

  const channel_ids = Object.keys(t_channel_ids).map((key) => {
    return t_channel_ids[Number(key)].channel_id;
  });
  lookup_channel.push(...channel_ids);
})();
LookupChannel.on('add', (channel_id) => {
  lookup_channel.push(channel_id);
  logger.debug(`lookup_channel add ${JSON.stringify(lookup_channel)}`);
});
LookupChannel.on('delete', (channel_id) => {
  const index = lookup_channel.indexOf(channel_id);
  if (index) lookup_channel[index] = null;
  logger.debug(`lookup_channel delete ${JSON.stringify(lookup_channel)}`);
});

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
  // Check if the message is sent in a channel that has been added with `/channel add`
  if (lookup_channel.indexOf(message.channelId) != -1)
    await processMessage(message);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const tr = new i18n(interaction);
  const command = Commands[interaction.commandName];

  // Get the cooldown data for the user and guild id (if needed)
  const ids: CooldownData | Collection<string, CooldownData> | undefined =
    cd.get(
      interaction.guildId
        ? [interaction.user.id, interaction.guildId]
        : interaction.user.id,
      command.data.name
    );

  // https://discord-api-types.dev/api/discord-api-types-payloads/common#PermissionFlagsBits
  const isAdmin = interaction.memberPermissions?.has(
    PermissionsBitField.Flags.Administrator
  );

  if (typeof ids === 'undefined' || ids.size === 0 || isAdmin) {
    // Thats mean there is not cooldown active on the user or guild
    // or the user is admin
    try {
      command.execute(interaction);
      // Add a cooldown following the cooldown rules
      const commandRule = cooldownRules[command.data.name];
      if (typeof commandRule.user === 'number') {
        cd.set(interaction.user.id, command.data.name, commandRule.user);
      }
      if (interaction.guildId && typeof commandRule.guild === 'number') {
        cd.set(interaction.guildId, command.data.name, commandRule.guild, true);
      }
      cd.purge();
    } catch (error) {
      // TODO: Report error
      logger.error(error);
      await interaction.reply({
        content: tr.t('message.commandError'),
        ephemeral: true,
      });
    }
  } else {
    // A Cooldown is active on the user or guild
    const duration = (ids: CooldownData | Collection<string, CooldownData>) => {
      if (ids instanceof Collection) {
        // TODO: If Collection has the user and server rate limit data get the one with farthest end date
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore size is > 0
        return cd.getDuration(ids.at(0).end);
      } else {
        return cd.getDuration(ids.end);
      }
    };

    const isGuild = ids.find((value) => value.isGuild === true);
    interaction.reply({
      content: tr.t('message.rateLimited', [
        cd.humanizeDuration(duration(ids), interaction),
      ]),
      ephemeral: isGuild ? false : true,
    });
  }
});

client.on('channelDelete', async (channel) => {
  const dbQuery = await db
    .del()
    .from(tn.lookup_channel)
    .where('channel_id', channel.id);
  if (dbQuery) {
    logger.info(`channel: ${channel.id} deleted: ${dbQuery}`);
    LookupChannel.emit('delete', channel.id);
  }
});

client.on('shardDisconnect', async (event) => {
  // TODO: Report error
  setTimeout(() => {
    client.destroy();
    client.login(process.env.DISCORD_TOKEN);
  }, 300000); // 5min
  logger.warn('Bot disconnected!', event);
});

client.login(process.env.DISCORD_TOKEN);
