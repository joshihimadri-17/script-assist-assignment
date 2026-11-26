---
name: playwright-test-generator
description: Generate maintainable Playwright tests from a clear feature or acceptance criteria.
---

# Playwright Test Generator

Create focused Playwright tests for the requested behavior.

- Inspect the existing project structure, configuration, fixtures, and page objects before editing.
- Reuse existing helpers and follow the project's TypeScript, lint, formatting, and test conventions.
- Prefer accessible role, label, and test-id locators; use web-first assertions.
- Keep tests isolated and deterministic. Avoid fixed sleeps and shared mutable test state.
- Add only tests that cover the requested behavior and meaningful edge cases.
- Run the narrowest relevant tests and checks, and report any failures clearly.
