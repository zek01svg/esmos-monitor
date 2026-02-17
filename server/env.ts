import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

export const env = createEnv({
  server: {
    BETTER_STACK_ERROR_DSN: z.url(),
    BETTER_STACK_ERROR_TOKEN: z.string(),
    BETTER_STACK_LOGS_DSN: z.url(),
    BETTER_STACK_LOGS_TOKEN: z.string(),

    SUPABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string(),

    AZURE_SUBSCRIPTION_ID: z.string(),
    AZURE_RESOURCE_GROUP: z.string(),
    AZURE_VM_NAME: z.string(),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
});
