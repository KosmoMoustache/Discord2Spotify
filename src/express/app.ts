import type { RenderPlaylist } from '../interfaces';
import express from 'express';
import session from 'express-session';
import consolidate from 'consolidate';
import { isAuthenticated } from './middleware';
import User from './User';
import SpotifyAuth from './authRoutes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  name: 'addtospotify.session',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24h
    secure: (process.env.NODE_ENV === 'production') ? true : false
  },
}));
app.set('trust proxy', 1); // trust first proxy // 2 for cloudflare + nignx ?
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.engine('html', consolidate.nunjucks);

// Spotify Authentication routes
app.use(SpotifyAuth);

app.get('/', async (req, res) => {
  // TODO: add invite link
  console.log('/ session:', req.session.user);

  res.render('index.html', { user: req.session.user });
});

app.get('/account', isAuthenticated, (req, res) => {
  res.render('account.html', { user: req.session.user });
});

app.get('/playlist', isAuthenticated, async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const profile = new User(req.session.user.spotify_id);
  profile.setUser(req.session.user);
  const playlists = await profile.fetchMyPlaylists(0, 50);
  const ownedPlaylists = playlists.items.filter((p) => p.owner.id === profile.spotify_id);
  const selectedPlaylists = await profile.getUserPlaylist();

  const render: RenderPlaylist = {
    user: profile,
    playlists: []
  };

  ownedPlaylists.forEach((p) => {
    const filter = selectedPlaylists.find((s) => s.playlist_id === p.id);
    render.playlists.push({
      ...p,
      selected: (filter) ? filter : undefined
    });
  });

  console.log(render);


  // TODO: Pagination
  // render.pagination = {
  //   next: playlists.next,
  //   previous: playlists.previous,
  //   current: playlists.offset,
  // };

  res.render('playlist.html', render);
});

app.post('/playlist', isAuthenticated, async (req, res) => {
  const { id } = req.body;
  if (id) {
    await new User(req.session.user.spotify_id).setUser(req.session.user).addUserPlaylist(id);
    res.json(<JsonResponse>{
      'message': 'OK',
      id: id,
    });
  } else {
    res.json(<JsonResponse>{
      message: 'Invalid ID',
      id: id,
    });
  }
});

app.delete('/playlist', isAuthenticated, async (req, res) => {
  const { id } = req.body;
  if (id) {
    await new User(req.session.user.spotify_id).setUser(req.session.user).deleteUserPlaylist(id);
    res.json(<JsonResponse>{
      'message': 'OK',
      id: id,
    });
  } else {
    res.json(<JsonResponse>{
      message: 'Invalid ID',
      id: id,
    });
  }
});

app.get('/login', (req, res) => {
  res.render('login.html', { user: req.session.user });
});

app.get('/logout', (req, res, next) => {
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in use
  req.session.user = null;
  req.session.save((err) => {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate((s_err) => {
      if (err) next(s_err);
      res.redirect('/');
    });
  });
});

export default app;