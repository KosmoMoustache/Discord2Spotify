import { OmitDefault, If } from '.';

type Table<B extends isQueryType, T extends TableType> = If<isQuery<B>, Omit<OmitDefault<T>, 'id'>, T>;
type TableType = User | UserTokens | UserChannel | UserPlaylist | RegisterLink | LookupChannel | ActionHistory;

type isQueryTypeInsert = 'insert' | 'i'
type isQueryTypeSelect = 'select' | 's'
type isQueryType = isQueryTypeInsert | isQueryTypeSelect
type isQuery<T extends isQueryType> = T extends isQueryTypeSelect ? false : T extends isQueryTypeInsert ? true : true

// Default 'insert' -> true = Omit id & default columns (created_at & updated_at)
export type TableUser<T extends isQueryType = 'insert'> = Table<T, User>;
export type TableTokens<T extends isQueryType = 'insert'> = Table<T, UserTokens>;
export type TableUserChannel<T extends isQueryType = 'insert'> = Table<T, UserChannel>;
export type TablePlaylist<T extends isQueryType = 'insert'> = Table<T, UserPlaylist>;
export type TableRegisterLink<T extends isQueryType = 'insert'> = Table<T, RegisterLink>;
export type TableLookupChannel<T extends isQueryType = 'insert'> = Table<T, LookupChannel>;
export type TableActionHistory<T extends isQueryType = 'insert'> = Table<T, ActionHistory>;

interface User extends DefaultColumns {
  id: number;
  spotify_id: string;
  discord_id: string | null;
  spotify_name: string;
  discord_name: string | null;
}

interface UserTokens extends DefaultColumns {
  id: number
  user_id: User['id'];
  access_token: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

interface UserChannel extends DefaultColumns {
  id: number;
  user_id: User['id'];
  discord_id: string;
  channel_id: string;
}

interface UserPlaylist extends DefaultColumns {
  id: number;
  user_id: User['id'];
  playlist_id: string;
  playlist_name: string | null;
  last_updated: string | null;
}

interface RegisterLink {
  id: number;
  uuid: string;
  discord_id: string;
  discord_name: `${string}#${string}`;
  is_expired: boolean;
  expiration_date: Date | string;
}

interface LookupChannel {
  id: number;
  guild_id: string;
  channel_id: string;
  discord_id: string;
}

interface ActionHistory extends DefaultColumns {
  id: number;
  user_id: User['id'];
  action_type: string;
  metadata?: Record<string, unknown> | null;
  url?: string | null;
}

interface DefaultColumns {
  created_at: string
  updated_at: string
}