import 'dotenv/config';

export type AppName = 'saucedemo' | 'todomvc' | 'restful-booker';

const defaultUrls = {
  saucedemo: 'https://www.saucedemo.com',
  todomvc: 'https://demo.playwright.dev/todomvc',
  'restful-booker': 'https://restful-booker.herokuapp.com',
} as const satisfies Record<AppName, string>;

function getUrl(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  const resolvedValue = value || fallback;
  let url: URL;
  try {
    url = new URL(resolvedValue);
  } catch (error) {
    throw new Error(`${name} must be an absolute HTTP or HTTPS URL.`, { cause: error });
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`${name} must use HTTP or HTTPS.`);
  }

  return resolvedValue;
}

function getAppName(value: string | undefined): AppName {
  const app = value?.trim() || 'saucedemo';
  if (app === 'saucedemo' || app === 'todomvc' || app === 'restful-booker') {
    return app;
  }

  throw new Error(`Unsupported APP "${app}". Choose saucedemo, todomvc, or restful-booker.`);
}

const bookingUsername = process.env.RESTFUL_BOOKER_USERNAME?.trim();
const bookingPassword = process.env.RESTFUL_BOOKER_PASSWORD?.trim();

if (Boolean(bookingUsername) !== Boolean(bookingPassword)) {
  throw new Error('RESTFUL_BOOKER_USERNAME and RESTFUL_BOOKER_PASSWORD must be provided together.');
}

const app = getAppName(process.env.APP);

export const environment = {
  app,
  urls: {
    saucedemo: getUrl('SAUCEDEMO_BASE_URL', defaultUrls.saucedemo),
    todomvc: getUrl('TODOMVC_BASE_URL', defaultUrls.todomvc),
    'restful-booker': getUrl('RESTFUL_BOOKER_BASE_URL', defaultUrls['restful-booker']),
  },
  credentials: {
    sauceDemoPassword: process.env.SAUCEDEMO_PASSWORD?.trim(),
    booking:
      bookingUsername && bookingPassword
        ? {
            username: bookingUsername,
            password: bookingPassword,
          }
        : undefined,
  },
} as const;
