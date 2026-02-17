import type { TestInfo } from '@playwright/test';
import logger from '../lib/pino';
import initSentry from 'server/lib/sentry';
import uploadScreenshot from './upload-screenshot';
/**
 * Logs to Better Stack Logs, reports error to Better Stack Errors and uploads screenshot to Supabase Storage.
 * @param testInfo - The test information.
 */
export default async function logAndReportError(
  testInfo: TestInfo,
  screenshotBuffer: Buffer,
  explicitError?: Error,
): Promise<void> {
  const Sentry = initSentry();

  if (testInfo.status !== 'passed' || explicitError) {
    const error = explicitError || testInfo.error;
    const errorMessage = `Test failed: ${testInfo.title}`;

    logger.error(errorMessage);
    if (error) {
      logger.error(error, `Error`);
      logger.error(error, `Stack`);
    }

    Sentry.captureException(error);

    // upload the screenshot to supabase
    await uploadScreenshot(screenshotBuffer, testInfo.title);
  }
}
