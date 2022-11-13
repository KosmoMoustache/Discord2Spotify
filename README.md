## Dotify

Git repos:
https://github.com/KosmoMoustache/Discord2Spotify

Inviter le bot:
https://discord.com/api/oauth2/authorize?client_id=1017722603261136896&permissions=156766579776&redirect_uri=https%3A%2F%2Fspotify.kosmo.ovh&response_type=code&scope=email%20identify%20bot%20applications.commands
https://discord.com/api/oauth2/authorize?client_id=1017722603261136896&redirect_uri=https%3A%2F%2Fspotify.kosmo.ovh&response_type=code&scope=email%20identify

TODO:
Translation fr->en
webhook report
todos
change bot's name
build
docker compose
docker compose prod & dev
-bot
-db
-express app
mise en prod

Prob déconnections:
increase closeTimeout

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
