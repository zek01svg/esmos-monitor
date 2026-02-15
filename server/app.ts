import { Hono } from 'hono';
import * as Sentry from '@sentry/bun';
import { env } from './env';
import errorHandler from './middleware/error-handler';

const app = new Hono();

// initialize sentry
Sentry.init({
  dsn: env.BETTER_STACK_ERROR_DSN,
  tracesSampleRate: 1.0,
  enableLogs: true,
});

// mount the error handling middleware
app.onError(errorHandler);

app.get('/', (c) => {
  return c.text('Server up');
});

export default app;
