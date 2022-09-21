import type { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export * from './table';
export * from './spotify';
export * from './express';

export type OmitDefault<T> = Omit<T, 'created_at' | 'updated_at' | 'deleted_at'>;
export type If<T extends boolean, A, B = null> = T extends true ? A : T extends false ? B : A | B;

export type DiscordUser = {
  display_name: string
  discriminator: string
  [key: string]: unknown;
}

export interface DiscordName {
  display_name: string;
  discriminator: string
}

export type ICommand = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
}

export interface SQLError extends Error {
  code: string;
  errno: SQLErrType | number;
  sqlState: string;
  sqlMessage: string;
  sql: string;
}

export enum SQLErrType {
  ER_DUP_ENTRY = 1062
}