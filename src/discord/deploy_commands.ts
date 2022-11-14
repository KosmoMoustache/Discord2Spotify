import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import CommandsList from './commands';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const commands = Object.values(CommandsList).map((command) => command.data);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest
  .put(Routes.applicationCommands(process.env.DISCORD_ID), { body: commands })
  .then((data) => {
    // @ts-expect-error data is type ApplicationCommandData[]
    console.log(`Successfully registered ${data.length} application commands.`);
    console.debug('raw data', data);
  })
  .catch((err) => console.error(JSON.stringify(err)));
