import app from './app';

const port = process.env.EXPRESS_PORT || 5050;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});