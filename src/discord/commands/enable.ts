import { SlashCommandBuilder } from 'discord.js';
import type { TableUser, TablePlaylist, TableUserChannel, ICommand } from '../../interfaces';
import db from '../../db';
import tn from '../../constants';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName('enable')
    .setDMPermission(false)
    .setDescription('Enable the bot to update your playlist from link of this channel')
    // TODO: Better description
    .setDescriptionLocalizations({
      fr: 'Permettre au bot de mettre a jour votre playlist a partir des liens de ce salon',
      'en-GB': 'Enable the bot to update your playlist from links of this channel'
    }),
  async execute(interaction) {
    const UserDB = await db
      .select<TableUser<'select'>>('id')
      .from(tn.user)
      .where('discord_id', interaction.user.id)
      .first();

    if (UserDB) {
      try {
        const countChannel = await db
          .count('id as count')
          .where('discord_id', interaction.user.id)
          .andWhere('channel_id', interaction.channelId)
          .from(tn.user_channel)
          .first();

        if (countChannel && countChannel.count > 1) {
          // Delete
          await db
            .del()
            .where('discord_id', interaction.user.id)
            .andWhere('channel_id', interaction.channelId)
            .from(tn.user_channel);

          // TODO: Reply a better message
          interaction.reply({ content: 'Salon supprimé!', ephemeral: true });
        } else {
          // Insert
          await db.insert(<TableUserChannel>{
            user_id: UserDB.id,
            discord_id: interaction.user.id,
            channel_id: interaction.channelId
          }).into(tn.user_channel);

          const userPlaylist = await db
            .select<TablePlaylist<'select'>>('id')
            .from(tn.user_playlist)
            .where('user_id', UserDB.id)
            .first();

          if (userPlaylist != undefined) {
            // TODO: Reply a better message
            interaction.reply({ content: 'Salon sauvegardé!', ephemeral: true });
          } else {
            interaction.reply({ content: `Salon sauvegardé! Mais vous n'avez pas configurer de playlist sur le site: ${process.env.APP_URI}/playlist`, ephemeral: true });
          }
        }
      } catch (error) {
        // TODO: Report incident
        console.error(error);
        interaction.reply(tn.message.dbError);
      }
    } else {
      interaction.reply({ content: 'Utilisateur introuvable. Merci de vous enregistrer au préalable en tapant la command `/register`', ephemeral: true });
    }
  }
};