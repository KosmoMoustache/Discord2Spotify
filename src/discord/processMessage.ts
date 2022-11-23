import type { TableUser, TableUserChannel } from '../interfaces';
import { SpotifyURLParser as URLParser } from '../utils/urlUtils';
import { Message } from 'discord.js';
import tn, { regex } from '../constants';
import UserManager from '../express/UserManager';
import db from '../db';

/**
 * @returns Array with url contained in the string variable or null if no urls if found
 */
export function getURLs(string: string): string[] | null {
  return string.match(regex.url);
}

type TableUserChannelJoinUser = TableUserChannel<'s'> & TableUser<'s'>;

/**
 * If message contains 1 ore more spotify's track links, update user's playlist and react to message 👍
 * @returns
 */
export async function processMessage(message: Message): Promise<void> {
  const URLs = getURLs(message.content);

  if (URLs) {
    URLs.forEach(async (url) => {
      console.log('url', url);

      const urlParsed = URLParser(url);
      if (urlParsed && urlParsed.type === 'track') {
        // get registered users
        const regUsers = await db
          .select<TableUserChannelJoinUser[]>()
          .from(tn.user_channel)
          .where('channel_id', message.channelId)
          .join('user', 'user_id', 'user.id');

        regUsers.forEach(async (user) => {
          const profile = new UserManager(user.spotify_id);
          profile.setUser(user);
          const user_playlist = (await profile.getUserPlaylist())[0];
          await profile.addItemsToPlaylist(user_playlist.playlist_id, [
            urlParsed.spotify_url,
          ]);
        });
        message.react('👍');
      }
    });
  }
}
