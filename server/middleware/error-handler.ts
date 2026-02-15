import type { Context } from 'hono';
import * as Sentry from '@sentry/bun';
import logger from '../lib/pino';

/**
 * This middleware catches all errors thrown in the application,
 * logs them to Better Stack Logs and Better Stack Errors
 */
export default async function errorHandler(
  err: Error,
  c: Context,
): Promise<Response> {
  logger.error(`[ErrorHandler] Path: ${c.req.path}, Method: ${c.req.method}`);
  logger.error(`Error: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);

  // send the logs using sentry sdk to better stack errors
  Sentry.captureException(err);

  return c.json(
    {
      message:
        'Internal Server Error; Errors sent to Better Stack Errors; Logs sent to Better Stack Logs',
    },
    500,
  );
}
