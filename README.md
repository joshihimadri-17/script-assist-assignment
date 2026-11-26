# Senior QA Automation Framework

A reusable Playwright + TypeScript framework for UI and REST API automation across
Sauce Demo, TodoMVC, and Restful Booker.

## Requirements

- Node.js 18 or newer
- npm
- Playwright Chromium browser

## Setup

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
```

Set the demo credentials in `.env` or your shell environment before running tests:

```dotenv
SAUCEDEMO_PASSWORD=<Sauce Demo demo password>
RESTFUL_BOOKER_USERNAME=<provided test account>
RESTFUL_BOOKER_PASSWORD=<provided test account password>
```

The `.env` file is ignored by Git. Never commit credentials. App URLs default to the
public demo sites and can be overridden with the corresponding `*_BASE_URL` variables.

## Run tests

```powershell
npm run test:saucedemo
npm run test:todomvc
npm run test:booking
npm run test:smoke
npm run test:regression
```

Playwright writes Allure results to `allure-results`. After running one or more app
suites, generate and open the combined HTML report:

```powershell
npm run allure:generate
npm run allure:open
```

The app can also be selected through the `APP` environment variable:

```powershell
$env:APP = 'todomvc'
npx playwright test
```

Supported values are `saucedemo`, `todomvc`, and `restful-booker`. UI and API tests
run in separate Playwright projects. Tags include `@smoke` and `@regression`.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run validate
```

## Design overview

- `pages/` holds page-specific locators and actions.
- `fixtures/` provides role-specific browser state and API test-data setup/cleanup.
- `clients/` contains the reusable Restful Booker client.
- `schemas/` validates API response shapes using Zod.
- `config/` owns app selection, URLs, roles, and tags.
- `test-data/` creates typed user and booking inputs.
- `tests/` is grouped by application and test type.
- `docs/` records triage, reliability, and AI-use notes.

Auth state is isolated by user role and worker. API fixtures always attempt cleanup,
including when a test fails. Traces and screenshots are retained for failures.
The completed Allure report is available as
[a downloadable ZIP archive](reports/Playwright_Ts_Allure_Report_2026-11-26.zip).
After downloading and extracting it, open `allure-report/index.html` in a browser.
Fresh test runs generate new local reports under `allure-report/`, which remains
ignored by Git.

## Adding another application

1. Add its typed entry and environment URL in `config/apps.config.ts` and
   `config/environment.ts`.
2. Add the corresponding UI or API Playwright project selection and test folder.
3. Implement app-specific page objects, fixtures, and typed test data where required.
4. Add focused tests and tags; do not share role state across users.
5. Add the app to the CI matrix and document any required CI secrets.
6. Run `npm run validate` and the selected app's test command.

## CI

GitHub Actions runs tagged smoke tests on pull requests and the full suite nightly.
Configure `SAUCEDEMO_PASSWORD`, `RESTFUL_BOOKER_USERNAME`, and
`RESTFUL_BOOKER_PASSWORD` as repository Actions secrets.
