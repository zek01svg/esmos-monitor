import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Contact Us Page', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should load the homepage with correct title and url', async ({
      page,
    }) => {
      await expect(page).toHaveTitle('Home | My Website');
      await expect(page).toHaveURL(
        'http://e08g08t01-prod.eastasia.cloudapp.azure.com:8069/',
      );
    });

    test('should redirect to contact us page', async ({ page }) => {
      const headerContactLink = page.getByRole('menuitem', {
        name: 'Contact us',
      });
      await expect(headerContactLink).toBeVisible();
      await headerContactLink.click();
    });
  });

  test.describe('Contact Us Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      const headerContactLink = page.getByRole('menuitem', {
        name: 'Contact us',
      });
      await headerContactLink.click();
    });

    test('should load the contact page with correct title and header', async ({
      page,
    }) => {
      await expect(page).toHaveTitle('Contact Us | My Website');
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText('Contact us');
    });

    test('should display contact information sidebar', async ({ page }) => {
      const sidebar = page.locator('ul.list-unstyled.mb-0.ps-2');
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toContainText('My Company');
      await expect(sidebar).toContainText('+1 555-555-5556');
      await expect(sidebar).toContainText('info@yourcompany.example.com');
    });

    test('should have a contact form and be able to submit it successfully', async ({
      page,
    }) => {
      const form = page.locator('form#contactus_form');
      await expect(form).toBeVisible();

      const nameInput = form.locator('input[name="name"]');
      await expect(nameInput).toBeVisible();
      await nameInput.fill('John Doe');

      const phoneInput = form.locator('input[name="phone"]');
      await expect(phoneInput).toBeVisible();
      await phoneInput.fill('89898989');

      const emailInput = form.locator('input[name="email_from"]');
      await expect(emailInput).toBeVisible();
      await emailInput.fill('john.doe@gmail.com');

      const companyInput = form.locator('input[name="company"]');
      await expect(companyInput).toBeVisible();
      await companyInput.fill('ESMOS');

      const subjectInput = form.locator('input[name="subject"]');
      await expect(subjectInput).toBeVisible();
      await subjectInput.fill('General Inquiry');

      const questionInput = form.locator('textarea[name="description"]');
      await expect(questionInput).toBeVisible();
      await questionInput.fill(
        'How is the ESM teaching team going to mess up ESMOS? ',
      );

      const submitBtn = form.locator('a.s_website_form_send');
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toHaveText('Submit');
      await submitBtn.click();
    });

    test('should not be able to submit form with empty fields', async ({
      page,
    }) => {
      const form = page.locator('form#contactus_form');
      await expect(form).toBeVisible();

      const submitBtn = form.locator('a.s_website_form_send');
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toHaveText('Submit');
      await submitBtn.click();

      const errorSpan = page.locator('#s_website_form_result');
      await expect(errorSpan).toBeVisible();
      await expect(errorSpan).toContainText(
        'Please fill in the form correctly.',
      );
    });
  });
});
