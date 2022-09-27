import type {
  TableTokens, TableUser, TablePlaylist, TableRegisterLink, Tokens, Playlist,
  SpotifyUser, SpotifyURI, GenericResponse, DiscordUser,
} from '../interfaces';
import { getServerBearerToken } from './SpotifyUtils';
import tn from '../constants';
import db from '../db';
import logger from '../logger';

export interface IClassUser /* extends Omit<TableUser, 'deleted_at'> */ {
  id?: number;
  spotify_id: string;
  discord_id?: string;
  spotify_name?: string;
  discord_name?: string;

  spotify_user?: SpotifyUser;
  discord_user?: DiscordUser;

  tokens?: Partial<Tokens>;
}

export default class User implements IClassUser {
  id!: number;
  spotify_id!: string;
  discord_id?: string;
  spotify_name!: string;
  discord_name?: string;

  spotify_user?: SpotifyUser;
  discord_user?: DiscordUser;

  tokens?: Partial<Tokens>;

  constructor(spotify_id: string, data?: SpotifyUser) {
    this.spotify_id = spotify_id;
    if (data) this.spotify_user = data;
  }

  // set this.id
  async getUser(spotify_id = this.spotify_id): Promise<User> {
    const dbQuery: TableUser = await db
      .select('*')
      .from(tn.user)
      .where('spotify_id', spotify_id)
      .first();

    Object.assign(this, dbQuery);
    return this;
  }

  setUser(data: User): User {
    Object.assign(this, data);
    return this;
  }

  async linkDiscord({ discord_id, discord_name }: TableRegisterLink) {
    await db
      .update({
        discord_id, discord_name
      })
      .from(tn.user)
      .where('id', this.id);

    this.discord_name = discord_name;
    this.discord_id = discord_id;
    this.discord_user = {
      ...this.discord_user,
      ...this.parseDiscordName(discord_name)
    };
  }

  parseDiscordName(discord_name: string): Pick<DiscordUser, 'display_name' | 'discriminator'> {
    const split = discord_name.split('#');
    return {
      display_name: split[0],
      discriminator: split[1]
    };
  }

  async updateUser(): Promise<User> {
    await db
      .insert(<TableUser>{
        spotify_id: this.spotify_id,
        spotify_name: this.spotify_user?.display_name
      })
      .onConflict().merge()
      .into(tn.user);
    return this;
  }

  async updateToken({ access_token, scope, expires_in, refresh_token }: Tokens): Promise<User> {
    this.tokens = {
      access_token,
      refresh_token,
      expires_in,
    };

    if (refresh_token) {
      await db
        .insert(<TableTokens>{
          user_id: this.id,
          access_token,
          scope,
          expires_in,
          refresh_token
        })
        .into(tn.user_tokens);
    } else {
      await db
        .update({
          access_token,
          scope,
          expires_in,
        })
        .from(tn.user_tokens)
        .where('user_id', this.id);
    }
    return this;
  }

  async addUserPlaylist(id: string, playlist_name: string | null = null): Promise<void> {
    await db
      .insert<TablePlaylist>({
        user_id: this.id,
        playlist_id: id,
        playlist_name: playlist_name,
      })
      .into(tn.user_playlist);
  }

  async deleteUserPlaylist(id: string): Promise<void> {
    await db
      .del()
      .from(tn.user_playlist)
      .where('user_id', this.id)
      .andWhere('id', id)
      .orWhere('playlist_id', id);
  }

  async getUserPlaylist(): Promise<TablePlaylist[]> {
    return await db
      .select('*')
      .from(tn.user_playlist)
      .where('user_id', this.id);
  }

  async getTokens(): Promise<Tokens> {
    // TODO: Read tokens from class itself (add field date for this.tokens and check expiration date

    const db_tokens: TableTokens<'s'> = await db
      .select('*')
      .from(tn.user_tokens)
      .where('user_id', this.id)
      .orderBy('id', 'desc')
      .first();

    const current_date = new Date().getTime();
    const token_date = new Date(db_tokens.created_at).getTime() + (db_tokens.expires_in * 1000);

    // Token is expired
    if (token_date < current_date) {
      logger.debug('Token is expired', new Date(token_date), new Date(current_date));
      const newToken = await this.refreshToken(db_tokens.refresh_token);
      this.updateToken(newToken);
      return newToken;
    }
    return db_tokens;
  }

  //
  // Spotify's API Method
  //

  /**
  * Get user's playlist
  * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-list-users-playlists
  * @param offset The index of the first playlist to return.
  *   Default: 0 (the first object). Maximum offset: 100.000.
  *   Use with limit to get the next set of playlists.
  * @param limit Maximum number of items to return. Default 20. Minimum: 1. Maximum: 50
  */
  async fetchMyPlaylists(offset = 0, limit = 20): Promise<GenericResponse<Playlist>> {
    const tokens = await this.getTokens();

    const API_URL = new URL(`https://api.spotify.com/v1/me/playlists?${new URLSearchParams({
      offset: String(offset), limit: String(limit)
    })}`);

    return await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`,
      }
    }).then(res => res.json());
  }

  async addItemsToPlaylist(playlist_id: string, uris: SpotifyURI[]): Promise<void> {
    const tokens = await this.getTokens();
    await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify({
        uris: uris
      })
    }).then(res => res.json());
  }

  /**
   * https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
   */
  async refreshToken(refresh_token: string): Promise<Tokens> {
    const tokenURL = new URL('https://accounts.spotify.com/api/token');
    tokenURL.searchParams.set('grant_type', 'refresh_token');
    tokenURL.searchParams.set('refresh_token', refresh_token);

    return await fetch(tokenURL.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': getServerBearerToken(),
      }
    }).then(resp => resp.json());
  }
}
