import type { ICommand } from '../../interfaces';
import { SlashCommandBuilder, type Snowflake } from 'discord.js';
import { commandsName } from '../../constants';
import { processMessage } from '../processMessage';
import i18n from '../../constants/i18n';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.READ)
    .setDMPermission(false)
    .setDescription('Analyse the last 3 messages')
    .setDescriptionLocalizations({
      fr: 'Analyse les 3 derniers messages',
    })
    .addStringOption((option) =>
      option
        .setName('id')
        .setRequired(false)
        .setDescription('Message id')
        .setDescriptionLocalizations({
          fr: 'Id du message',
        })
    ),
  async execute(interaction) {
    const tr = new i18n(interaction, 'commands.read');

    if (interaction.channel) {
      const messageId = interaction.options.get('id', false);
      // Check given message id
      if (messageId) {
        const message = await interaction.channel.messages
          .fetch(messageId.value as Snowflake)
          .then((message) => {
            return message;
          })
          .catch(console.error);

        if (message) {
          await processMessage(message);

          interaction.reply({
            content: tr.t('done'),
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: tr.t('invalidId'),
            ephemeral: true,
          });
        }

        // Check last 3 messages
      } else {
        const channel = interaction.client.channels.cache.get(
          interaction.channelId
        );

        if (channel?.isTextBased()) {
          const messages = await channel.messages.fetch({
            limit: 3,
            cache: false,
          });

          messages.forEach((message) => {
            processMessage(message);
          });

          interaction.reply({
            content: tr.t('done'),
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: tr.t('notTextBased'),
            ephemeral: true,
          });
        }
      }
    }
  },
};
