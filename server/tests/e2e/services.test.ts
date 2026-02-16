import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Services Page', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/our-services');
  });

  test('should load the services page with correct title and header', async ({
    page,
  }) => {
    await expect(page).toHaveTitle('Services | My Website');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Services');
  });

  test('should display service columns with correct content', async ({
    page,
  }) => {
    const freshIngredients = page.locator('.card-body h3', {
      hasText: 'Fresh Ingredients',
    });
    await expect(freshIngredients).toBeVisible();
    await expect(
      page.locator('.card-text', { hasText: 'Customize your meal plan' }),
    ).toBeVisible();

    const seasonalSpecials = page.locator('.card-body h3', {
      hasText: 'Seasonal Specials',
    });
    await expect(seasonalSpecials).toBeVisible();
    await expect(
      page.locator('.card-text', { hasText: 'To add a fourth meal option' }),
    ).toBeVisible();

    const quickMealPrep = page.locator('.card-body h3', {
      hasText: 'Quick Meal Prep',
    });
    await expect(quickMealPrep).toBeVisible();
    await expect(
      page.locator('.card-text', { hasText: 'Replace the above image' }),
    ).toBeVisible(); // Based on placeholder text in provided HTML
  });

  test('should display quotes carousel', async ({ page }) => {
    const carousel = page.locator('.s_quotes_carousel');
    await expect(carousel).toBeVisible();

    // Check for at least one quote visibility (might need to wait for carousel but at least one item is active)
    const activeQuote = carousel.locator('.carousel-item.active blockquote');
    await expect(activeQuote).toBeVisible();
    const quoteText = activeQuote.locator('p');
    // Based on HTML, the active quote is "The best meal delivery service..."
    await expect(quoteText).toContainText('The best meal delivery service');
  });

  test('should display happy customers section', async ({ page }) => {
    const referencesSection = page.locator('section.s_references');
    await expect(referencesSection).toBeVisible();

    const heading = referencesSection.locator('h2');
    await expect(heading).toHaveText('Our Happy Customers');

    const customerImages = referencesSection.locator('img');
    // There are 6 images in the row
    await expect(customerImages).toHaveCount(6);
  });
});
