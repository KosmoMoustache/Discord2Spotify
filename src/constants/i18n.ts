import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import logger from '../logger';
import translations from './translations';

export default class i18n {
  locale!: string;
  interaction?: ChatInputCommandInteraction<CacheType>;
  keyStart: string | null;

  constructor(
    interaction: ChatInputCommandInteraction<CacheType>,
    keyStart?: string
  ) {
    this.locale = interaction.locale.split('-')[0];
    this.interaction = interaction;
    this.keyStart = keyStart ? keyStart : null;
  }

  /**
   * Get en translation string with a key
   * @example
   *  getTranslation('message.rateLimited', 'fr', ['12m']) => "Délai d'attente: 12m avant la prochaine utilisation de la commande"
   */
  getTranslations(
    key: string,
    locale: string,
    replaceValues?: string[]
  ): string {
    this.locale = locale;
    return this.t(key, replaceValues);
  }

  /**
   * Replace a placeholder with real value
   * @example
   * replacePlaceholder('A super long %s', ['string']) => 'A super long string'
   */
  replacePlaceholder(baseString: string, replaceValues: string[]): string {
    const iterator = Array.from(baseString.matchAll(/%s/g));
    for (let i = 0; i < iterator.length; i++) {
      baseString = baseString.replace('%s', replaceValues[i]);
    }
    return baseString;
  }

  /**
   * Reverse a string
   * @param string String you want to reverse
   * @example
   *  reverse('Hello') => 'olleH'
   * @returns
   */
  reverse(string: string): string {
    return string.split('').reverse().join('');
  }

  /**
   * Main function
   * @param ignoreKeyStart to ignore the `keyStart` of the class constructor
   * @returns
   */
  t(key: string, replaceValues?: string[], ignoreKeyStart = false): string {
    try {
      if (this.keyStart && ignoreKeyStart == false) {
        key = this.reverse(
          this.reverse(key) + this.reverse(this.keyStart + '.')
        );
      }

      // to remove GB/US etc
      const paths = key.split('.');
      let data: object | string;
      if (translations[this.locale]) {
        data = translations[this.locale];
      } else {
        data = translations['en'];
      }
      for (const index in paths) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore idk how to type that
        data = data[paths[index]];
      }

      if (typeof data === 'string') {
        if (replaceValues) data = this.replacePlaceholder(data, replaceValues);
        return data;
      }

      // If key is not found return the key
      return `${key} ${this.locale ? 'local' : 'en'}`;
    } catch (error) {
      logger.error(error);
      return key;
    }
  }
}
