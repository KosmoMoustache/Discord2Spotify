import app from './express/app';
import client from './discord/index';

const port = process.env.EXPRESS_PORT || 5050;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});


client.login(process.env.DISCORD_TOKEN);