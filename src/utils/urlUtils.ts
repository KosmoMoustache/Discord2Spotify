import { SpotifyURI } from '../interfaces';

export function SpotifyURLParser(url: string): null | {
  type: 'track' | 'artist' | 'album' | 'playlist';
  url: string;
  spotify_url: SpotifyURI;
} {
  const regexs = [
    new RegExp(/^(https:\/\/open.spotify.com\/track\/)([\w\d]{22})/),
    new RegExp(/^(https:\/\/open.spotify.com\/artist\/)([\w\d]{22})/),
    new RegExp(/^(https:\/\/open.spotify.com\/album\/)([\w\d]{22})/),
    new RegExp(/^(https:\/\/open.spotify.com\/playlist\/)([\w\d]{22})/),
  ];
  const type = ['track', 'artist', 'album', 'playlist'];

  for (let i = 0; i < regexs.length; i++) {
    const exec = regexs[i].exec(url);
    if (exec) {
      return {
        type: type[i] as 'track' | 'artist' | 'album' | 'playlist',
        url: exec[0],
        spotify_url: `spotify:${type[i]}:${exec[2]}`,
      };
    }
  }
  return null;
}
