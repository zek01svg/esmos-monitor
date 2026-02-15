import { test, expect } from '@playwright/test';
import logAndReportError from 'server/services/report-error';
import type { TestInfo } from '@playwright/test';

test.describe('Homepage', () => {
  test.afterEach(async ({ page }, testInfo: TestInfo) => {
    if (testInfo.status !== 'passed') {
      const screenshotBuffer = await page.screenshot();
      await logAndReportError(testInfo, screenshotBuffer);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Home | My Website');
    await expect(page).toHaveURL(
      'http://e08g08t01-prod.eastasia.cloudapp.azure.com:8069/',
    );
  });

  test.describe('Header Navigation', () => {
    test('should check for logo and main navigation links', async ({
      page,
    }) => {
      // Check Logo - Scoped to Main (Desktop) Navbar
      const logo = page.locator('nav[aria-label="Main"] a.navbar-brand.logo');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('href', '/');

      // Check Navigation Links
      const nav = page.locator('#top_menu');
      const links = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Services', href: '/our-services' },
        { name: 'Contact us', href: 'contact us' },
      ];

      for (const link of links) {
        if (link.name === 'Contact us') {
          const contactLink = nav.locator('a.nav-link', { hasText: link.name });
          await expect(contactLink).toBeVisible();
        } else {
          const navLink = nav.locator(`a.nav-link[href="${link.href}"]`, {
            hasText: link.name,
          });
          await expect(navLink).toBeVisible();
        }
      }
    });

    test('should have a visible "Sign in" button', async ({ page }) => {
      // Scoped to Main (Desktop) Navbar to avoid ambiguity
      const signInBtn = page.locator(
        'nav[aria-label="Main"] a[href="/web/login"]',
        { hasText: 'Sign in' },
      );
      await expect(signInBtn).toBeVisible();
    });

    test('should have a search button/modal', async ({ page }) => {
      const searchBtn = page.locator('a[data-bs-target="#o_search_modal"]');
      await expect(searchBtn).toBeVisible();
    });

    test('should have a cart icon', async ({ page }) => {
      // Scoped to Main (Desktop) Navbar
      const cartIcon = page.locator(
        'nav[aria-label="Main"] a[href="/shop/cart"]',
      );
      await expect(cartIcon).toBeVisible();
    });
  });

  test.describe('Main Content', () => {
    test('should display the Hero section correctly', async ({ page }) => {
      const heroSection = page.locator('section.s_cover');
      await expect(heroSection).toBeVisible();

      const heading = heroSection.locator('h1');
      await expect(heading).toHaveText('Healthy Eating Made Easy');

      const subText = heroSection.locator('p.lead');
      await expect(subText).toContainText('Explore our diverse menu');

      const ctaButton = heroSection.locator('a.btn-primary', {
        hasText: 'Get in touch',
      });
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toHaveAttribute('href', '/contactus');
    });

    test('should display "Your Meal, Your Way" section', async ({ page }) => {
      const section = page.locator('section.s_text_image');
      await expect(section).toBeVisible();

      const heading = section.locator('h2');
      await expect(heading).toHaveText('Your Meal, Your Way');

      const ctaButton = section.locator('a.btn-secondary', {
        hasText: 'Ask us a question',
      });
      await expect(ctaButton).toBeVisible();
      // Verify link contains the survey part or starts with /survey
      await expect(ctaButton).toHaveAttribute('href', /^\/survey\/start\//);
    });

    test('should display visual statistics (Numbers section)', async ({
      page,
    }) => {
      const numbersSection = page.locator('section.s_numbers');
      await expect(numbersSection).toBeVisible();

      const stats = [
        { value: '12', label: 'Flexible meal plans' },
        { value: '45', label: 'Delicious meals' },
        { value: '8', label: 'Incredible recipes' },
        { value: '370', label: 'Meals delivered' },
      ];

      for (const stat of stats) {
        // Find the column containing the label
        const statBlock = numbersSection.locator('.col-lg-3', {
          hasText: stat.label,
        });
        await expect(statBlock).toBeVisible();
        // Verify the number within that block
        await expect(statBlock.locator('.s_number')).toHaveText(stat.value);
      }
    });
  });

  test.describe('Footer', () => {
    test('should display useful links', async ({ page }) => {
      const footer = page.locator('footer#bottom');
      await expect(footer).toBeVisible();

      const usefulLinks = [
        'Home',
        'About us',
        'Products',
        'Privacy Policy',
        'Forum',
        'Contact us',
      ];

      const linksSection = footer.locator('.col-lg-2', {
        hasText: 'Useful Links',
      });
      for (const linkText of usefulLinks) {
        await expect(
          linksSection.locator(`a:has-text("${linkText}")`),
        ).toBeVisible();
      }
    });

    test('should display "About us" section in footer', async ({ page }) => {
      const aboutSection = page.locator('footer#bottom .col-lg-5', {
        hasText: 'About us',
      });
      await expect(aboutSection).toBeVisible();
      await expect(aboutSection).toContainText(
        'Everyday Sustainable Meals Ordering System',
      );
    });

    test('should display "Connect with us" section', async ({ page }) => {
      const connectSection = page.locator('footer#bottom #connect');
      await expect(connectSection).toBeVisible();

      // Email link check
      const emailLink = connectSection.locator('a[href^="mailto:"]');
      await expect(emailLink).toBeVisible();
      await expect(emailLink).toHaveAttribute(
        'href',
        'mailto:support@esmos.meals.sg',
      );
    });

    test('should display social media links', async ({ page }) => {
      const socialSection = page.locator('footer#bottom .s_social_media');
      const socials = ['Facebook', 'Twitter', 'LinkedIn'];

      for (const social of socials) {
        await expect(
          socialSection.locator(`a[aria-label="${social}"]`),
        ).toBeVisible();
      }
    });

    test('should display copyright info', async ({ page }) => {
      const copyright = page.locator('.o_footer_copyright_name');
      await expect(copyright).toContainText('Copyright © ESMOS2025');
    });
  });
});
