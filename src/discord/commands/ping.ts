import { SlashCommandBuilder } from 'discord.js';
import type { ICommand } from '../../interfaces';

export default <ICommand>{
  data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
  async execute(interaction) {
    console.log(interaction);

    await interaction.reply({ content: 'Pong!', ephemeral: true });
  },
};
