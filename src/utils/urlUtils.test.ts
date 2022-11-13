import { SpotifyURLParser as URLParser } from './urlUtils';

describe('Spotify URL parser', () => {
  it('should return track', () => {
    const result = URLParser(
      'https://open.spotify.com/track/353enWUcS4d05dALJa5paQ'
    );
    expect(result).toEqual({
      type: 'track',
      url: 'https://open.spotify.com/track/353enWUcS4d05dALJa5paQ',
      spotify_url: 'spotify:track:353enWUcS4d05dALJa5paQ',
    });
  });
  it('should return artist', () => {
    const result = URLParser(
      'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH?si=JzklT6reQ7aKG8Sm_SnyJQ'
    );
    expect(result).toEqual({
      type: 'artist',
      url: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
      spotify_url: 'spotify:artist:6qqNVTkY8uBg9cP3Jd7DAH',
    });
  });
  it('should return album', () => {
    const result = URLParser(
      'https://open.spotify.com/album/5lLW6oART9vCKCGaV46yWo?si=yeIMXWI-SPmgmP0kbgbjqQ'
    );
    expect(result).toEqual({
      type: 'album',
      url: 'https://open.spotify.com/album/5lLW6oART9vCKCGaV46yWo',
      spotify_url: 'spotify:album:5lLW6oART9vCKCGaV46yWo',
    });
  });
  it('should return playlist', () => {
    const result = URLParser(
      'https://open.spotify.com/playlist/37i9dQZF1DX0MEwcNgXyz3?si=276cd83a341c43be'
    );
    expect(result).toEqual({
      type: 'playlist',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX0MEwcNgXyz3',
      spotify_url: 'spotify:playlist:37i9dQZF1DX0MEwcNgXyz3',
    });
  });
});
