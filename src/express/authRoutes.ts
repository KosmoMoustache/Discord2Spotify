import type { Tokens } from '../interfaces';
import express from 'express';
import crypto from 'crypto';
import { AUTH_CALLBACK_PATH, REDIRECT_URI, regex } from '../constants';
import { getMyProfile, getRegisterLink, getServerBearerToken } from './SpotifyUtils';
import User from './User';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/auth/spotify', (req, res) => {
  // TODO: check uuid expiration date
  const uuid = req.query.uuid as string | null;

  if (uuid && !regex.uuidv4.test(uuid)) {
    const redirect_url = '/' + '?error=invalid_uuid';
    res.redirect(redirect_url);
  }

  const state = `${crypto.randomBytes(16).toString('hex')}${(uuid) ? `#${uuid}` : ''}`;

  // https://developer.spotify.com/documentation/general/guides/authorization/scopes/
  const scope = 'playlist-modify-private playlist-read-private';

  const spotify_url = new URL('https://accounts.spotify.com/authorize');
  spotify_url.searchParams.set('response_type', 'code');
  spotify_url.searchParams.set('client_id', process.env.SPOTIFY_ID);
  spotify_url.searchParams.set('scope', scope);
  spotify_url.searchParams.set('show_dialog', 'true');
  spotify_url.searchParams.set('redirect_uri', redirect_uri);
  spotify_url.searchParams.set('state', state);

  res.redirect(spotify_url.toString());
});

// Callback path
router.get(authCallbackPath, async (req, res) => {
  // TODO: check state validity (regex )
  const code = req.query.code as string | null;
  const state = req.query.state as string | null;

  // TODO: Compare the received state with the original one, if there is a mismatch reject the request
  if (state === null) {
    const redirect_url = '/' + '?error=state_mismatch';
    res.redirect(redirect_url);
  } else if (regex.state_or_state_and_uuid.test(state)) {
    // Request user access token
    const tokenURL = new URL('https://accounts.spotify.com/api/token');
    tokenURL.searchParams.set('code', code as string);
    tokenURL.searchParams.set('redirect_uri', redirect_uri);
    tokenURL.searchParams.set('grant_type', 'authorization_code');

    const tokens: Tokens = await fetch(tokenURL.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': getServerBearerToken()
      }
    }).then(resp => resp.json());

    const currentProfile = await getMyProfile(tokens.access_token);
    const profile = await new User(currentProfile.id, currentProfile);
    await profile.updateUser();
    await profile.getUser();
    await profile.updateToken(tokens);

    if (regex.state_and_uuid.test(state)) {
      const register = await getRegisterLink(state.split('#')[1]);
      if (register) await profile.linkDiscord(register);
    }

    req.session.user = profile;
    res.redirect('/');
  }
});

export default router;