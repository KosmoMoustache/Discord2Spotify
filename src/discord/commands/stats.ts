import type { ICommand } from './../../interfaces';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import tn, { commandsName } from './../../constants';
import i18n from './../../constants/i18n';
import db from './../../db';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.STATS)
    .setDescription('Information of the bot')
    .setDescriptionLocalizations({
      fr: 'Information sur le bot',
    })
    .setDMPermission(false),
  async execute(interaction) {
    const tr = new i18n(interaction, 'commands.stats');
    // TODO: Docker  ~dockerContainerStats()
    // package systeminformation
    // docker.push(await si.dockerContainerStats());

    const { client } = interaction;
    const duration = moment
      .utc(moment.duration(client.uptime).asMilliseconds())
      .format(' D[d], H[h], m[m]');

    const channel_scanned = async (): Promise<number> => {
      const query = await db
        .count('id as count')
        .from(tn.lookup_channel)
        .first();

      if (query) {
        return query.count as number;
      }
      return 0;
    };

    const embed = new EmbedBuilder();
    embed.setTitle(tr.t('title'));
    embed.addFields(
      {
        name: `:ping_pong: ${tr.t('ping')}`,
        value: `┕\`${Math.round(client.ws.ping)}ms\``,
        inline: true,
      },
      {
        name: `:clock1: ${tr.t('uptime')}`,
        value: `┕\`${duration}\``,
        inline: true,
      },
      {
        name: `:file_cabinet: ${tr.t('memory')}`,
        value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )}mb\``,
        inline: true,
      }
    );

    embed.addFields(
      {
        name: `:homes: ${tr.t('servers')}`,
        value: `┕\`${client.guilds.cache.size}\``,
        inline: true,
      },
      {
        name: `:hash: ${tr.t('channelScanned')}`,
        value: `┕\`${await channel_scanned()}\``,
        inline: true,
      }
    );

    embed.addFields({
      name: `:robot: ${tr.t('version')}`,
      value: `┕\`v${tn.version}\``,
      inline: true,
    });

    interaction.reply({ embeds: [embed] });
  },
};
