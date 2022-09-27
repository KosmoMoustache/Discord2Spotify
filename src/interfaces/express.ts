import User from '../express/User';
import { Playlist, TablePlaylist } from '.';

export interface RenderPlaylist {
  user: User;
  playlists: EPlaylist[],
  pagination?: {
    next: string,
    previous: string,
    current: string
  }
}

export interface EPlaylist extends Playlist {
  selected?: TablePlaylist
}

export interface JsonResponse extends Record<string, unknown> {
  message: string
}