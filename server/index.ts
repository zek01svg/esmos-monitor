import app from './app';
import { env } from './env';
import logger from './lib/pino';

const port = env.PORT;
const url = env.APP_URL;
const start = Date.now();
const server = {
  port: port,
  fetch: app.fetch,
};

logger.info(`🚀 Server is running on ${url}`);
logger.info(`✅ Ready in ${Date.now() - start} ms`);
logger.info(`🧠 Bun v${Bun.version}`);

export default server;
