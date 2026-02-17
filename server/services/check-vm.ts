import { ComputeManagementClient } from '@azure/arm-compute';
import { DefaultAzureCredential } from '@azure/identity';
import { env } from '../env.ts';
import { spawn } from 'child_process';
import logger from 'server/lib/pino.ts';
import initSentry from 'server/lib/sentry';

async function checkVmAndRunTests() {
  logger.info(
    `Checking status of VM: ${env.AZURE_VM_NAME} in ${env.AZURE_RESOURCE_GROUP}...`,
  );

  try {
    const credential = new DefaultAzureCredential();
    const computeClient = new ComputeManagementClient(
      credential,
      env.AZURE_SUBSCRIPTION_ID,
    );

    const instanceView = await computeClient.virtualMachines.instanceView(
      env.AZURE_RESOURCE_GROUP,
      env.AZURE_VM_NAME,
    );

    const statuses = instanceView.statuses;
    const powerState = statuses?.find((s) => s.code?.startsWith('PowerState/'));

    logger.info(`VM Power State: ${powerState?.displayStatus}`);

    if (powerState?.code === 'PowerState/running') {
      logger.info('VM is running. Proceeding with tests...');
      runTests();
    } else {
      logger.info('VM is NOT running. Skipping tests.');
      process.exit(0);
    }
  } catch (error) {
    const Sentry = initSentry();
    logger.error(error, 'Error checking VM status');
    Sentry.captureException(error);

    process.exit(1);
  }
}

function runTests() {
  const testProcess = spawn(
    'pnpm',
    ['exec', 'playwright', 'test', 'server/tests/e2e'],
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  testProcess.on('close', (code) => {
    process.exit(code ?? 1);
  });
}

checkVmAndRunTests();
