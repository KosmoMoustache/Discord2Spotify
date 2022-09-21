TODO:
- Dockerfile
- [ ] Refaire le lien d'invitation
  - [ ] Permission (2147493952)
- [ ] Dockerfile
- [ ] Refaire l'interface du site, (FrameworkJS ou Tailwindcss ?)
- [ ] Command /channel delete
- [ ] i18n
- [ ] TODO dans le code 
- [ ] Reporte les erreurs + logger dans action_history
- [ ] Cacher les requêtes vers l'API de spotify

https://discord.com/api/oauth2/authorize?client_id=1017722603261136896&permissions=156766579776&redirect_uri=https%3A%2F%2Fspotify.kosmo.ovh&response_type=code&scope=email%20identify%20bot%20applications.commands
https://discord.com/api/oauth2/authorize?client_id=1017722603261136896&redirect_uri=https%3A%2F%2Fspotify.kosmo.ovh&response_type=code&scope=email%20identify

Inviter le bot:

Lien github:
  https://github.com/KosmoMoustache/Discord2Spotify


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

`DISCORD_KEY`=discord secret key  
`DISCORD_TOKEN`=discord token

`SPOTIFY_ID`=spotify app id  
`SPOTIFY_SECRET`=spotify app secret

`EXPRESS_PORT`=express port  default: 5050  
https://expressjs.com/en/resources/middleware/session.html#secret  
`EXPRESS_SESSION_SECRET`=express session secret

`APP_URI`=URL to the website (ex: https://spotify.kosmo.ovh)