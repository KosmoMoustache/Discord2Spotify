## Dotify

Git repos:
https://github.com/KosmoMoustache/Discord2Spotify

Bot invite url:

TODO:

- [ ] webhook report
- [ ] todos inside code
- [ ] change bot's name
- [ ] docker container
  - [ ] build typescript to javascript
    - [ ] separate bot/express code
  - [ ] docker compose prod & dev (bot, express, db)

https://developer.spotify.com/documentation/general/design-and-branding/

# Drop tables

```sql
DROP TABLE action_history;
DROP TABLE knex_migrations;
DROP TABLE knex_migrations_lock;
DROP TABLE lookup_channel;
DROP TABLE register_link;
DROP TABLE user_channel;
DROP TABLE user_playlist;
DROP TABLE user_tokens;
DROP TABLE user;
```

# Environment variable:

`MARIADB_USER`=admin  
`MARIADB_PASSWORD`=admin  
`MARIADB_ROOT_PASSWORD`=root  
`MARIADB_DATABASE`=spotify  
`MARIADB_HOST`=localhost

`DISCORD_ID`=discord bot id
`DISCORD_KEY`=discord secret key  
`DISCORD_TOKEN`=discord token

`DISCORD_WEBHOOK`=discord webhook url to report incident (crash, db error...)

`SPOTIFY_ID`=spotify app id  
`SPOTIFY_SECRET`=spotify app secret

`EXPRESS_PORT`=express port default: 5050  
https://expressjs.com/en/resources/middleware/session.html#secret  
`EXPRESS_SESSION_SECRET`=express session secret

`APP_URI`=URL to the website (ex: https://spotify.kosmo.ovh)
