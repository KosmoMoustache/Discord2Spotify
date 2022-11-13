import { CacheType, ChatInputCommandInteraction, Collection } from 'discord.js';
import { commandsName } from '../constants';
import humanizeDuration from 'humanize-duration';

export interface CooldownData {
  commandName: commandsName;
  end: Date;
  isGuild?: boolean;
}

export const cooldownRules: {
  [key in commandsName]: {
    user: false | number;
    guild: false | number;
  };
} = {
  channel: {
    user: 60,
    guild: 60,
  },
  enable: {
    user: 60,
    guild: false,
  },
  locale: {
    user: 120,
    guild: 120,
  },
  ping: {
    user: false,
    guild: false,
  },
  read: {
    user: 60,
    guild: 60,
  },
  register: {
    user: 30,
    guild: false,
  },
  stats: {
    user: 60,
    guild: 60,
  },
};

export default class CooldownManager {
  cd: Collection<string, CooldownData>;

  constructor() {
    this.cd = new Collection();
  }

  get(id: string): CooldownData | undefined;
  get(
    id: string | string[],
    commandName?: commandsName
  ): Collection<string, CooldownData>;
  /**
   * Get the CooldownData associated with the id(s)
   */
  get(id: string | string[], commandName?: commandsName) {
    if (typeof id === 'string' && !commandName) {
      return this.cd.get(id);
    } else if (typeof id === 'string' && commandName) {
      return this.cd.filter(
        (value, key) => key === id && value.commandName === commandName
      );
    }

    if (typeof id === 'object' && !commandName) {
      return this.cd.filter((value, key) => id.indexOf(key) != -1);
    } else if (typeof id === 'object' && commandName) {
      return this.cd.filter(
        (value, key) =>
          id.indexOf(key) != -1 && value.commandName === commandName
      );
    }
  }
  /**
   * Add an entry to the cooldown Collection
   * @param id User or guild id
   * @param commandName
   * @param secondes time in secondes the ban will occur
   * @param isGuild if id is a guild id
   */
  set(
    id: string,
    commandName: commandsName,
    seconds: number,
    isGuild?: true
  ): void {
    this.cd.set(id, {
      commandName,
      end: this.getDate(seconds),
      isGuild: isGuild ? true : false,
    });
  }
  /**
   *
   * @param id
   */
  delete(id: string): void {
    this.cd.delete(id);
  }
  /**
   * Purge every entry with an cooldown end value in the past
   */
  purge(): void {
    this.cd
      .filter((value) => value.end.getMilliseconds() > Date.now())
      .forEach((value, key) => this.cd.delete(key));
  }
  /**
   * Take a duration and output it in a readable format in the correct locale according
   * to the user who invoked the interaction or the guild from the interaction was sent
   * @param duration duration in ms
   * @param interaction
   * @returns
   */
  humanizeDuration(
    duration: number,
    interaction: ChatInputCommandInteraction<CacheType>
  ): string {
    return humanizeDuration(duration, {
      language: interaction.locale.split('-')[0],
      fallbacks: interaction.guild
        ? [interaction.guild.preferredLocale, 'en']
        : ['en'],
      round: true,
    });
  }
  /**
   * @param date
   * @returns  Return the time in ms between 2 dates
   */
  getDuration(date: Date): number {
    return new Date().getTime() - date.getTime();
  }
  /**
   * @param secondes
   * @returns Date.now() + secondes
   */
  getDate(secondes: number): Date {
    return new Date(Date.now() + secondes * 1000);
  }
  get toJSON() {
    return this.cd.toJSON();
  }
}
