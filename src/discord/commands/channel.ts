/* eslint-disable indent */ // switch case: https://github.com/microsoft/TypeScript/issues/18682
import { ICommand, TableUserChannel, SQLErrType } from '../../interfaces';
import {
  ChannelType, APIEmbedField,
  SlashCommandBuilder, EmbedBuilder, userMention, channelMention, TextChannel,
} from 'discord.js';
import { isSQLError } from '../../utils';
import moment from 'moment';
import db from '../../db';
import tn from '../../constants';

// TODO: delete subcommand
export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Add a channel that the bot will scan')
    .setDMPermission(false)
    .addSubcommand((subcommand) => subcommand
      .setName('get')
      .setDescription('Returns the channels than the bot scan')
      .setDescriptionLocalizations({
        fr: 'Retourne les salons que le bot scanne',
        'en-GB': 'Return the channels than the bot scan',
      })
    )
    .addSubcommand((subcommand) => subcommand
      .setName('add')
      .setDescription('Add a channel that the bot will scan')
      .setDescriptionLocalizations({
        fr: 'Ajoute un salon que le bot scannera',
        'en-GB': 'Add a channel that the bot will scan',
      })
      .addChannelOption((p) => p
        .setName('channel')
        .setRequired(true)
        .setDescription('Channel to scan')
        .setDescriptionLocalizations({
          fr: 'Salon à scanner',
          'en-GB': 'Channel to scan',
        })
        .addChannelTypes(ChannelType.GuildText)
      )
    ),
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'add': {
        // TODO: Type correctly this
        const command_options = interaction.options.get('channel', true);
        try {
          await db
            .insert<TableUserChannel>({
              guild_id: (command_options.channel as unknown as TextChannel).guildId,
              channel_id: (command_options.channel as unknown as TextChannel).id,
              discord_id: interaction.user.id,
            })
            .into(tn.lookup_channel);
          await interaction.reply(`Salon: ${channelMention((command_options.channel as unknown as TextChannel).id)} ajouté!`);
        } catch (error) {
          if (isSQLError(error) && error.errno === SQLErrType.ER_DUP_ENTRY) {
            await interaction.reply('Ce salon est déjà enregistré');
          } else {
            // TODO: Report error
            console.error(error);
            await interaction.reply(tn.message.dbError);
          }
        }
      } break;
      case 'get': {
        const dbQuery = await db
          .select<TableUserChannel<'select'>[]>('*')
          .from(tn.lookup_channel)
          .where('guild_id', interaction.guildId)
          .limit(26);

        console.debug('/channel get:', dbQuery);

        if (dbQuery.length > 0) {
          const embed = new EmbedBuilder();
          embed
            .setTitle(`Salon${(dbQuery.length > 1) ? 's' : ''} en écoute sur ce serveur ${(dbQuery.length > 25) ? '(Réponse limité à 25 salons)' : ''}`)
            .setDescription('ajouté le, par');

          const channels: APIEmbedField[] = [];
          dbQuery.slice(0, 25).forEach(async (channel) => {
            channels.push({
              name: moment(channel.created_at).format('MM-DD-YYYY'),
              value: `${channelMention(channel.channel_id)} par ${userMention(String(channel.discord_id))} `,
            });
          });
          embed.addFields(channels);

          await interaction.reply({ embeds: [embed] });
        } else {
          interaction.reply('Aucun salon est en écoute sur ce serveur, pour en ajouter utilisez la commande `/channel add` suivis d\'un salon');
        }
      } break;
      default: {
        // TODO: Report error
        console.error(interaction);
      } break;
    }
  },
};
