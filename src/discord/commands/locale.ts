import { SlashCommandBuilder, Locale } from 'discord.js';
import type { ICommand } from '../../interfaces';
import { commandsName } from '../../constants';
import translations from '../../constants/translations';
import i18n from '../../constants/i18n';

type choice = { name: string; value: string };

/**
 * @returns available translations in the local i18n
 */
function getTranslationsCode(): choice[] {
  return Object.keys(translations).map((key) => {
    return { name: translations[key].localName as string, value: key };
  });
}

/**
 * @returns supported locale by Discord
 */
function getLocale(): choice[] {
  return (Object.keys(Locale) as Array<keyof typeof Locale>).map((key) => {
    return { name: key, value: Locale[key] };
  });
}

/**
 *
 * @param localCode
 * @returns the locale name from a local code
 * @example
 * "fr" => "French"
 * "en-GB" => "EnglishGB"
 * or Not Found
 */
function reverseLocale(localCode: string): string {
  return (
    Object.keys(Locale).filter(
      (lc) => (Locale as { [key: string]: string })[lc] === localCode
    )[0] || 'Not Found'
  );
}

export default <ICommand>{
  data: new SlashCommandBuilder()
    .setName(commandsName.LOCALE)
    .setDMPermission(false)
    .setDescription('Change the preferred locale for the server')
    .setDescriptionLocalizations({
      fr: 'Change la localisation préféré du serveur',
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription('Return the current preferred locale')
        .setDescriptionLocalizations({
          fr: 'Retourne la localisation courante du serveur',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Change the preferred local for this server')
        .setDescriptionLocalizations({
          fr: 'Change la localisation préféré du serveur',
        })
        .addStringOption((option) =>
          option
            .setName('locale')
            .setRequired(true)
            .setDescription('Locale')
            // choices are limited to 25
            // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
            .setChoices(...getTranslationsCode().slice(0, 25))
        )
    ),
  async execute(interaction) {
    const tr = new i18n(interaction, 'commands.locale');

    switch (interaction.options.getSubcommand()) {
      case 'get':
        {
          interaction.reply(
            tr.t('replyGet', [interaction.guild?.preferredLocale || ''])
          );
        }
        break;
      case 'set':
        {
          const input_locale = interaction.options.get('locale', true);

          interaction.guild
            ?.setPreferredLocale(input_locale.value as unknown as Locale)
            .then((updated) =>
              interaction.reply(
                tr.t('replySet', [reverseLocale(updated.preferredLocale)])
              )
            )
            .catch((err) => console.error(err));
        }
        break;
    }
  },
};
