import { test as base, expect } from '@playwright/test';
import { environment } from '../config/environment';

type TestFixtures = {
  appCredentials: typeof environment.credentials;
};

export const test = base.extend<TestFixtures>({
  appCredentials: async (_fixtures, use) => {
    await use(environment.credentials);
  },
});

export { expect };
