import {
  type APIEmbedField,
  ChannelType,
  SlashCommandBuilder,
  TextChannel,
  EmbedBuilder,
  userMention,
  channelMention,
} from 'discord.js';
import {
  type ICommand,
  type TableUserChannel,
  SQLErrType,
} from '../../interfaces';
import moment from 'moment';
import tn, { commandsName } from '../../constants';
import LookupChannel from '../lookupChannel';
import { isSQLError } from '../../utils';
import i18n from '../../constants/i18n';
import logger from '../../logger';
import db from '../../db';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.CHANNEL)
    .setDescription('Channels commands')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription('Returns the channels that the bot scan on this server')
        .setDescriptionLocalizations({
          fr: 'Retourne les salons que le bot analyse sur ce serveur',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a channel that the bot will scan')
        .setDescriptionLocalizations({
          fr: 'Ajoute un salon que le bot analysera',
        })
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setRequired(true)
            .setDescription('Channel to scan')
            .setDescriptionLocalizations({
              fr: 'Salon à scanner',
            })
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription("Remove channel from the bot's scan list")
        .setDescriptionLocalizations({
          fr: "Supprime un salon de la liste d'analyse du bot",
        })
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setRequired(true)
            .setDescription('Channel to delete')
            .setDescriptionLocalizations({
              fr: 'Salon à supprimer',
              'en-GB': 'Channel to delete',
            })
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
  async execute(interaction) {
    const tr = new i18n(interaction, 'commands.channel');

    switch (interaction.options.getSubcommand()) {
      case 'add':
        {
          const command_options = interaction.options.getChannel(
            'channel',
            true
          );

          try {
            await db
              .insert<TableUserChannel>({
                guild_id: (command_options as TextChannel).guildId,
                channel_id: command_options.id,
                discord_id: interaction.user.id,
              })
              .into(tn.lookup_channel);

            // Emission of an event to update lookup_channel array
            LookupChannel.emit('add', command_options.id);

            await interaction.reply(
              tr.t('add.reply', [channelMention(command_options.id)])
            );
          } catch (error) {
            if (isSQLError(error) && error.errno === SQLErrType.ER_DUP_ENTRY) {
              await interaction.reply(tr.t('message.alreadySaved'));
            } else {
              // TODO: Report error
              logger.error(error);
              await interaction.reply(tr.t('message.dbError'));
            }
          }
        }
        break;
      case 'get':
        {
          const dbQuery = await db
            .select<TableUserChannel<'select'>[]>('*')
            .from(tn.lookup_channel)
            .where('guild_id', interaction.guildId)
            .limit(26);

          if (dbQuery.length > 0) {
            const embed = new EmbedBuilder();
            embed
              .setTitle(
                tr.t('get.embed.title', [
                  dbQuery.length > 1 ? 's' : '',
                  dbQuery.length > 25 ? tr.t('get.embed.limited') : '',
                ])
              )
              .setDescription(tr.t('get.embed.description'));

            const channels: APIEmbedField[] = [];
            dbQuery.slice(0, 25).forEach(async (channel) => {
              channels.push({
                name: moment(channel.created_at).format('MM-DD-YYYY'),
                value: `${channelMention(channel.channel_id)} par ${userMention(
                  String(channel.discord_id)
                )} `,
              });
            });
            embed.addFields(channels);

            await interaction.reply({ embeds: [embed] });
          } else {
            interaction.reply(tr.t('get.reply'));
          }
        }
        break;
      case 'delete':
        {
          const command_options = interaction.options.getChannel(
            'channel',
            true
          );

          await db
            .del()
            .from(tn.lookup_channel)
            .where('channel_id', command_options.id);
          // Emission of an event to update lookup_channel array
          LookupChannel.emit('delete', command_options.id);

          interaction.reply(tr.t('delete.reply', [command_options.name]));
        }
        break;
      default:
        {
          // TODO: Report error
          logger.error(interaction);
        }
        break;
    }
  },
};
