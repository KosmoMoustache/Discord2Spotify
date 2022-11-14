import type { ICommand } from '../../interfaces';
import { SlashCommandBuilder } from 'discord.js';
import { commandsName } from '../../constants';
import i18n from '../../constants/i18n';

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.PING)
    .setDescription('Pong!'),
  async execute(interaction) {
    const tr = new i18n(interaction);

    console.log(interaction);
    await interaction.reply({
      content: tr.t('commands.ping'),
      ephemeral: true,
    });
  },
};
