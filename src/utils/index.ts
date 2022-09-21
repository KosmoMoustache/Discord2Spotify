import type { Client } from 'discord.js';
import type { SQLError } from '../interfaces';
import { ActivityType } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSQLError = (err: any): err is SQLError => {
  return err.sql !== undefined;
};

export function UpdateActivity(
  client: Client<true>,
  activity: string,
  type: Exclude<ActivityType, ActivityType.Custom> = ActivityType.Watching
): void {
  client.user.setActivity(activity, { type: type });
}