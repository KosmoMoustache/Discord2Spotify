import logger from '../logger';
import app from './app';

const port = process.env.EXPRESS_PORT || 5050;
app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});