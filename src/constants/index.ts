export default {
  user: 'user',
  user_channel: 'user_channel',
  user_playlist: 'user_playlist',
  user_tokens: 'user_tokens',
  register_link: 'register_link',
  lookup_channel: 'lookup_channel',
  action_history: 'action_history',
  version: 2,
  projectName: 'Dotify',
};

export const regex = {
  state_or_state_and_uuid: new RegExp(
    /[0-9A-Za-z]{32}$|[0-9A-Za-z]{32}#([0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12})/
  ),
  uuidv4: new RegExp(
    /[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/
  ),
  state_and_uuid: new RegExp(
    /[0-9A-Za-z]{32}#([0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12})/
  ),
  url: new RegExp(
    /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/g
  ),
};

export const AUTH_CALLBACK_PATH = '/auth/spotify/callback';
export const REDIRECT_URI =
  process.env.NODE_ENV != 'development'
    ? `https://spotify.kosmo.ovh${AUTH_CALLBACK_PATH}`
    : `http://localhost:${process.env.EXPRESS_PORT}${AUTH_CALLBACK_PATH}`;

export enum commandsName {
  CHANNEL = 'channel',
  ENABLE = 'enable',
  LOCALE = 'locale',
  PING = 'ping',
  READ = 'read',
  REGISTER = 'register',
  STATS = 'stats',
}
export enum commandsId {
  channel = 'CHANNEL',
  enable = 'ENABLE',
  locale = 'LOCALE',
  ping = 'PING',
  read = 'READ',
  register = 'REGISTER',
  stats = 'STATS',
}
