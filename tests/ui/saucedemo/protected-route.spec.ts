import { expect, test } from '@playwright/test';
import { environment } from '../../../config/environment';

test('redirects unauthenticated users from inventory to login @regression @saucedemo', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: environment.urls.saucedemo,
  });

  try {
    const page = await context.newPage();
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  } finally {
    await context.close();
  }
});
