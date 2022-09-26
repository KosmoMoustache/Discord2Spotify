import i18n from './i18n';

export default {
  user: 'user',
  user_channel: 'user_channel',
  user_playlist: 'user_playlist',
  user_tokens: 'user_tokens',
  register_link: 'register_link',
  lookup_channel: 'lookup_channel',
  action_history: 'action_history',
  version: 1,
  projectName: 'Discord2Spotify',
  ...i18n
};

export const regex = {
  state_or_state_and_uuid: new RegExp(/[0-9A-Za-z]{32}$|[0-9A-Za-z]{32}#([0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12})/),
  uuidv4: new RegExp(/[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/),
  state_and_uuid: new RegExp(/[0-9A-Za-z]{32}#([0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12})/),
};

// projectName: ['addToSpotify', 'Discord2Spotify', 'Playsica', 'Cobot', 'Dotify']

export const AUTH_CALLBACK_PATH = '/auth/spotify/callback';
export const REDIRECT_URI = (process.env.NODE_ENV === 'production')
  ? 'https://spotify.kosmo.ovh' + AUTH_CALLBACK_PATH
  : 'http://localhost:' + process.env.EXPRESS_PORT + AUTH_CALLBACK_PATH;