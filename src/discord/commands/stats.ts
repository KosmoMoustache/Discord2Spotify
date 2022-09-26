import type { ICommand } from '../../interfaces';
import { Client, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import moment from 'moment';
import tn from '../../constants/';
import db from '../../db';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get information about the bot')
    .setDMPermission(false),
  async execute(interaction) {
    // TODO: Docker  ~dockerContainerStats()
    // package systeminformation
    // docker.push(await si.dockerContainerStats());

    const client: Client<true> = interaction.client;
    const duration = moment.utc(moment.duration(client.uptime).asMilliseconds()).format(' D[d], H[h], m[m]');
    const channel_scanned = async (): Promise<number> => {
      const query = await db
        .count('id as count')
        .from(tn.lookup_channel)
        .first();

      if (query) {
        return query.count as number;
      } else {
        return 0;
      }
    };

    const playlist_updated = 'Soon™';

    const embed = new EmbedBuilder();
    embed.setTitle(`Stats from \`${client.user.username}\``);
    embed.addFields(
      {
        name: ':ping_pong: Ping',
        value: `┕\`${Math.round(client.ws.ping)}ms\``,
        inline: true,
      },
      {
        name: ':clock1: Uptime',
        value: `┕\`${duration}\``,
        inline: true,
      },
      {
        name: ':file_cabinet: Memory',
        value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )}mb\``,
        inline: true,
      }
    );

    embed.addFields(
      {
        name: ':homes: Servers',
        value: `┕\`${client.guilds.cache.size}\``,
        inline: true,
      },
      {
        name: ':cd: Playlist updated',
        value: `┕\`${playlist_updated}\``,
        inline: true,
      },
      {
        name: ':hash: Channels scanned',
        value: `┕\`${await channel_scanned()}\``,
        inline: true
      }
    );

    embed.addFields(
      {
        name: ':robot: Version',
        value: `┕\`v${tn.version}\``,
        inline: true,
      }
    );

    interaction.reply({ embeds: [embed] });
  },
};
