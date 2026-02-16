import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test('should load the homepage with correct title and url', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Home | My Website');
    await expect(page).toHaveURL(
      'http://e08g08t01-prod.eastasia.cloudapp.azure.com:8069/',
    );
  });

  test('should have a functional sign-in link', async ({ page }) => {
    const signInBtn = page.locator(
      'nav[aria-label="Main"] a[href="/web/login"]',
      { hasText: 'Sign in' },
    );

    await expect(signInBtn).toBeVisible();
    await signInBtn.click();
    await expect(page).toHaveURL(
      'http://e08g08t01-prod.eastasia.cloudapp.azure.com:8069/web/login',
    );
  });

  test.describe('Login Page Elements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/web/login');
    });

    test('should validate login form fields', async ({ page }) => {
      await expect(page.getByRole('form')).toBeVisible();

      const emailInput = page.locator('input[name="login"]');
      await expect(emailInput).toHaveAttribute('type', 'text');
      await expect(emailInput).toHaveAttribute('placeholder', 'Email');

      const passwordInput = page.locator('input[name="password"]');
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Multi-Role Authentication', () => {
    const USERS = [
      { role: 'System Configurator', email: 'sysconfig@esmos.meals.sg' },
      { role: 'Product Manager', email: 'prodmanager@esmos.meals.sg' },
      { role: 'Data Manager', email: 'datamanager@esmos.meals.sg' },
      { role: 'Security Manager', email: 'security@esmos.meals.sg' },
      { role: 'Support Manager', email: 'support@esmos.meals.sg' },
    ];

    for (const user of USERS) {
      test(`${user.role} should be able to log in`, async ({ page }) => {
        await page.goto('/web/login');

        await page.locator('input[name="login"]').fill(user.email);
        await page
          .locator('input[name="password"]')
          .fill(process.env.ADMIN_PASSWORD!);
        await page.getByRole('button', { name: 'Log in' }).click();

        await expect(page).toHaveTitle('Odoo');
        await expect(page).toHaveURL(
          'http://e08g08t01-prod.eastasia.cloudapp.azure.com:8069/web',
        );
      });
    }
  });
});
