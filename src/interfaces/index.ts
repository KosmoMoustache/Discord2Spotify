import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { commandsName } from '../constants';

export * from './table';
export * from './spotify';
export * from './express';

export type OmitDefault<T> = Omit<
  T,
  'created_at' | 'updated_at' | 'deleted_at'
>;
export type If<T extends boolean, A, B = null> = T extends true
  ? A
  : T extends false
  ? B
  : A | B;

export type DiscordUser = {
  display_name: string;
  discriminator: string;
  [key: string]: unknown;
};

export interface DiscordName {
  display_name: string;
  discriminator: string;
}

type ISlashCommandBuilder = SlashCommandBuilder & {
  name: commandsName;
};
export type ICommand = {
  data: ISlashCommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
};

export interface SQLError extends Error {
  code: string;
  errno: SQLErrType | number;
  sqlState: string;
  sqlMessage: string;
  sql: string;
}

export enum SQLErrType {
  ER_DUP_ENTRY = 1062,
}

export enum ActionType {
  LOGIN,
  LOGOUT,
  ACCOUNT_CREATION,
  ACCOUNT_LINKING,
  USER_PLAYLIST_UPDATE,
  USER_PLAYLIST_DELETE,
  OTHER,
}
