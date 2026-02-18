import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Shop Page', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Shop | My Website');
  });

  test('should have a search bar', async ({ page }) => {
    const searchInput = page.getByRole('search');
    await expect(searchInput).toBeVisible();
  });

  test('should have sorting options', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Featured' })).toBeVisible();
    await page.getByRole('button', { name: 'Featured' }).click();

    await expect(
      page.getByRole('menuitem', { name: 'Featured' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Newest Arrivals' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Name (A-Z)' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Price - Low to High' }),
    ).toBeVisible();
    await expect(
      page.getByRole('menuitem', { name: 'Price - High to Low' }),
    ).toBeVisible();
  });

  test('should display product grid', async ({ page }) => {
    const productGrid = page.locator('#products_grid');
    await expect(productGrid).toBeVisible();
  });

  test('should have 10 products on display', async ({ page }) => {
    const products = page.locator('.oe_product');
    await expect(products).toHaveCount(10);
  });

  test('should display correct products', async ({ page }) => {
    const productNames = [
      'Low Carb meal plan',
      'Weight Loss Wonders',
      'Superfood Boost',
      'Plant-Based Meal Plan',
      'Office Lunch Box',
      'Meal Prep Made Simple',
      'Low Carb Meal Plan',
      'Diabetic-Friendly Meal Plan',
      'Detox Plan',
      "Athlete's Power Pack",
    ];

    for (const productName of productNames) {
      await expect(page.getByText(productName, { exact: true })).toBeVisible();
    }
  });

  test('should display correct product details for all items', async ({
    page,
  }) => {
    const products = [
      { name: 'Low Carb meal plan', price: '50.00' },
      { name: 'Weight Loss Wonders', price: '47.00' },
      { name: 'Superfood Boost', price: '60.00' },
      { name: 'Plant-Based Meal Plan', price: '42.00' },
      { name: 'Office Lunch Box', price: '70.00' },
      { name: 'Meal Prep Made Simple', price: '39.00' },
      { name: 'Low Carb Meal Plan', price: '50.00' },
      { name: 'Diabetic-Friendly Meal Plan', price: '52.00' },
      { name: 'Detox Plan', price: '50.00' },
      { name: "Athlete's Power Pack", price: '49.00' },
    ];

    for (const product of products) {
      await page.goto('/shop');

      await page
        .getByRole('heading', { name: product.name, exact: true })
        .getByRole('link')
        .click();

      // product name
      await expect(
        page.getByRole('heading', { name: product.name }),
      ).toBeVisible();

      // product price
      await expect(page.getByText('$').first()).toBeVisible();
      await expect(page.getByText('$').first()).toContainText(product.price);

      // product img
      await expect(page.getByRole('img', { name: product.name })).toBeVisible();
    }
  });
});
