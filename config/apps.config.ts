import { environment, type AppName } from './environment';

export type AppKind = 'ui' | 'api';

export interface AppConfiguration {
  readonly name: AppName;
  readonly kind: AppKind;
  readonly baseUrl: string;
  readonly testMatch: readonly string[];
  readonly testIdAttribute?: string;
  readonly tags: readonly string[];
  readonly roles: readonly string[];
}

export const apps = {
  saucedemo: {
    name: 'saucedemo',
    kind: 'ui',
    baseUrl: environment.urls.saucedemo,
    testMatch: ['**/ui/saucedemo/**/*.spec.ts', '**/triage/**/*.spec.ts'],
    testIdAttribute: 'data-test',
    tags: ['@saucedemo', '@ui'],
    roles: ['standard_user', 'locked_out_user', 'problem_user', 'performance_glitch_user'],
  },
  todomvc: {
    name: 'todomvc',
    kind: 'ui',
    baseUrl: environment.urls.todomvc,
    testMatch: ['**/ui/todomvc/**/*.spec.ts'],
    testIdAttribute: 'data-testid',
    tags: ['@todomvc', '@ui'],
    roles: [],
  },
  'restful-booker': {
    name: 'restful-booker',
    kind: 'api',
    baseUrl: environment.urls['restful-booker'],
    testMatch: ['**/api/**/*.spec.ts'],
    tags: ['@restful-booker', '@api'],
    roles: [],
  },
} as const satisfies Record<AppName, AppConfiguration>;

export const selectedApp: AppConfiguration = apps[environment.app];
