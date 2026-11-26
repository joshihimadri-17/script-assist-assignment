import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test as base } from '@playwright/test';
import { environment } from '../config/environment';
import { LoginPage } from '../pages/saucedemo/LoginPage';
import { getSauceDemoUser, type SauceDemoRole } from '../test-data/users';

type AuthFixtures = {
  userRole: SauceDemoRole | 'none';
};

const statePromises = new Map<string, Promise<string>>();

export const test = base.extend<AuthFixtures>({
  userRole: ['none', { option: true }],
  storageState: async ({ browser, userRole }, use, workerInfo) => {
    if (userRole === 'none') {
      await use(undefined);
      return;
    }

    if (userRole === 'locked_out_user') {
      throw new Error(
        'locked_out_user cannot create an authenticated storage state; use it in a login test instead.',
      );
    }

    const statePath = path.resolve(
      process.cwd(),
      'playwright',
      '.auth',
      `${userRole}-worker-${workerInfo.workerIndex}.json`,
    );
    const cacheKey = `${workerInfo.workerIndex}:${statePath}`;
    let statePromise = statePromises.get(cacheKey);

    if (!statePromise) {
      const authenticationPromise = (async () => {
        await mkdir(path.dirname(statePath), { recursive: true });
        const context = await browser.newContext({
          baseURL: environment.urls.saucedemo,
        });
        try {
          const page = await context.newPage();
          const loginPage = new LoginPage(page);
          const user = getSauceDemoUser(userRole);
          await loginPage.goto();
          await loginPage.login(user.username, user.password);
          await page.waitForURL('**/inventory.html');
          await context.storageState({ path: statePath });
          return statePath;
        } finally {
          await context.close();
        }
      })();
      statePromises.set(cacheKey, authenticationPromise);
      void authenticationPromise.catch(() => {
        if (statePromises.get(cacheKey) === authenticationPromise) {
          statePromises.delete(cacheKey);
        }
      });
      statePromise = authenticationPromise;
    }

    await use(await statePromise);
  },
});

export { expect };
