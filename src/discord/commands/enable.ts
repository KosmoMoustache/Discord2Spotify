import { SlashCommandBuilder } from 'discord.js';
import type {
  TableUser,
  TablePlaylist,
  TableUserChannel,
  ICommand,
} from '../../interfaces';
import tn, { commandsName } from '../../constants';
import i18n from '../../constants/i18n';
import logger from '../../logger';
import db from '../../db';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.ENABLE)
    .setDMPermission(false)
    .setDescription("Allow this channel to the update your Spotify's Playlist")
    .setDescriptionLocalizations({
      fr: 'Permettre à ce salon de mettre à jour de votre Playlist Spotify',
    }),
  async execute(interaction) {
    const tr = new i18n(interaction, 'commands.enable');

    const UserDB = await db
      .select<TableUser<'select'>>('id')
      .from(tn.user)
      .where('discord_id', interaction.user.id)
      .first();

    if (UserDB) {
      try {
        // Knowing if the channel is already enable, in that case we need to disabling it
        const countChannel = await db
          .count('id as count')
          .where('discord_id', interaction.user.id)
          .andWhere('channel_id', interaction.channelId)
          .from(tn.user_channel)
          .first();

        if (countChannel && countChannel.count > 1) {
          // Channel if found id db
          // Delete
          await db
            .del()
            .where('discord_id', interaction.user.id)
            .andWhere('channel_id', interaction.channelId)
            .from(tn.user_channel);

          interaction.reply({
            content: tr.t('deleted'),
            ephemeral: true,
          });
        } else {
          // Channel not found in db
          // Insert
          await db
            .insert(<TableUserChannel>{
              user_id: UserDB.id,
              discord_id: interaction.user.id,
              channel_id: interaction.channelId,
            })
            .into(tn.user_channel);

          const userPlaylist = await db
            .select<TablePlaylist<'s'>>('id')
            .from(tn.user_playlist)
            .where('user_id', UserDB.id)
            .first();

          interaction.reply({
            content:
              userPlaylist != undefined
                ? tr.t('saved')
                : tr.t('saveNoPlaylist', [process.env.APP_URI]),
            ephemeral: true,
          });
        }
      } catch (error) {
        // TODO: Report
        logger.error(error);
        interaction.reply(tr.t('message.dbError'));
      }
    } else {
      interaction.reply({
        content: tr.t('notFound'),
        ephemeral: true,
      });
    }
  },
};
