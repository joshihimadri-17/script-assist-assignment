import { expect, test } from '@playwright/test';
import { LoginPage } from '../../../pages/saucedemo/LoginPage';
import { getSauceDemoUser } from '../../../test-data/users';

test('logs in with a valid user @smoke @saucedemo', async ({ page }) => {
  const user = getSauceDemoUser('standard_user');
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(user.username, user.password);

  await expect(page).toHaveURL(/inventory\.html$/);
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('shows an error for invalid credentials @regression @saucedemo', async ({ page }) => {
  const user = getSauceDemoUser('standard_user');
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('invalid_user', user.password);

  await expect(loginPage.getErrorMessage()).toContainText('Username and password do not match');
});

test('blocks a locked-out user @regression @saucedemo', async ({ page }) => {
  const user = getSauceDemoUser('locked_out_user');
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(user.username, user.password);

  await expect(loginPage.getErrorMessage()).toContainText('Sorry, this user has been locked out');
  await expect(page).not.toHaveURL(/inventory\.html$/);
});

test('allows the performance-glitch user to sign in @regression @saucedemo', async ({ page }) => {
  const user = getSauceDemoUser('performance_glitch_user');
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(user.username, user.password);

  await expect(page).toHaveURL(/inventory\.html$/);
  await expect(page.getByTestId('title')).toHaveText('Products');
});
