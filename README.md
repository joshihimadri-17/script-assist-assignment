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

Run by Playwright project:

```powershell
npm run test:ui
npm run test:api
```

`test:ui` uses the selected `APP` (default: `saucedemo`). `test:api` selects
`APP=restful-booker`. You can also pair the app and project explicitly:

```powershell
$env:APP = 'saucedemo'
npx playwright test --project=ui

$env:APP = 'todomvc'
npx playwright test --project=ui

$env:APP = 'restful-booker'
npx playwright test --project=api
```

Run the app-specific suites:

```powershell
npm run test:saucedemo
npm run test:todomvc
npm run test:booking
```

Run smoke or regression tests for the selected `APP`:

```powershell
npm run test:smoke
npm run test:regression
```

For example, set `$env:APP = 'restful-booker'` before `npm run test:smoke` to
select the Restful Booker smoke cases. A project/app mismatch collects no tests,
so selecting the API project cannot accidentally run UI tests.

Playwright writes Allure results to `allure-results`. After running one or more app
suites, generate and open the combined HTML report:

```powershell
npm run allure:generate
npm run allure:open
```

Supported values are `saucedemo`, `todomvc`, and `restful-booker`. UI and API tests
are registered as separate Playwright projects. Tags include `@smoke` and
`@regression`.

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

1. Add the app name to `AppName`, its default URL, validation, and environment URL
   mapping in `config/environment.ts`.
2. Add its typed `AppConfiguration` in `config/apps.config.ts`, including `kind`,
   `testMatch`, tags, roles, and the UI test-id attribute where applicable. Keep its
   test match scoped to that app's folder.
3. Add app-specific tests under `tests/ui/<app>/` or `tests/api/` as appropriate.
   Implement page objects in `pages/`, fixtures, schemas, and typed test data only
   where the app needs them.
4. Add a dedicated npm script that sets `APP` and the matching `--project` (UI or
   API). Verify that the matching project discovers the app's tests and the other
   project discovers none.
5. Add an `{ app, project }` entry to the GitHub Actions matrix and document any
   required repository secrets.
6. Run `npm run validate`, the app-specific test script, and the repeat-execution
   check. Record only results that were actually observed.

## CI

GitHub Actions runs tagged smoke tests on pull requests and the full selected-app
suite on the nightly schedule (and manual dispatch). Its matrix explicitly pairs
Sauce Demo and TodoMVC with `ui`, and Restful Booker with `api`. It caches npm
dependencies and uploads the Playwright HTML report, Allure results/report, and
`test-results/` artifacts, which include retained traces and failure screenshots.
Configure `SAUCEDEMO_PASSWORD`, `RESTFUL_BOOKER_USERNAME`, and
`RESTFUL_BOOKER_PASSWORD` as repository Actions secrets. Secrets are not available
to workflows from forked pull requests, so credential-dependent cases require an
appropriate trusted-runner workflow.
