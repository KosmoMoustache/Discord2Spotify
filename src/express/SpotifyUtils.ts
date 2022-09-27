import type { SpotifyUser, TableRegisterLink } from '../interfaces';
import db from '../db';
import tn from '../constants';

export function getServerBearerToken(): string {
  return 'Basic ' + Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
}

/**
* @description https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile
*/
export async function getMyProfile(token: string): Promise<SpotifyUser> {
  return await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
}


export async function getRegisterLink(uuid: string, updateExpired = true): Promise<TableRegisterLink<'s'> | null> {
  // TODO: is_expired = true after being used
  const dbQuery = await db
    .select<TableRegisterLink<'s'>>('*')
    .from(tn.register_link)
    .where('uuid', uuid)
    .where('expiration_date', '>', new Date())
    .first();

  if (dbQuery && updateExpired) {
    await db
      .update<TableRegisterLink>({
        is_expired: true
      })
      .from(tn.register_link)
      .where('id', dbQuery.id);
    return dbQuery;
  }
  return null;
}