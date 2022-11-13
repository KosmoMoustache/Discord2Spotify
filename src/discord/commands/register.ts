import { Channel, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import type { ICommand, TableRegisterLink } from '../../interfaces';
import db from '../../db';
import tn, { commandsName } from '../../constants';
import i18n from '../../constants/i18n';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.REGISTER)
    .setDescription('Link your Spotify and Discord account')
    .setDescriptionLocalizations({
      fr: 'Lier ton compte Spotify et Discord',
    }),
  async execute(interaction) {
    const tr = new i18n(interaction, 'commands.register');

    const channel_type = (
      (await interaction.client.channels.fetch(
        interaction.channelId
      )) as Channel
    ).type;
    const code = uuidv4();

    await db
      .insert(<TableRegisterLink>{
        uuid: code,
        discord_id: interaction.user.id,
        discord_name: `${interaction.user.username}#${interaction.user.discriminator}`,
        expiration_date: moment().add(1, 'h').toDate(),
      })
      .into(tn.register_link);

    const embed = new EmbedBuilder();
    embed.setTitle(tr.t('embed.title', [tn.projectName]));
    embed.setDescription(`${process.env.APP_URI}/auth/spotify?uuid=${code}`);

    // Reply directly if interaction is in DM
    if (channel_type === 1) {
      // 1 = DM (https://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType)
      await interaction.reply({ embeds: [embed] });
    } else {
      // Send embeds in dm
      (await interaction.client.users.fetch(interaction.user.id)).send({
        embeds: [embed],
      });
      // Reply
      await interaction.reply({
        content: tr.t('checkDM'),
        ephemeral: true,
      });
    }
  },
};
