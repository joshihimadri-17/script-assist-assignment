---
name: playwright-test-healer
description: Diagnose and fix an existing flaky or failing Playwright test.
---

# Playwright Test Healer

Investigate the root cause of the reported Playwright failure before changing code.

- Inspect the failing test, relevant fixtures and page objects, configuration, and failure artifacts.
- Distinguish product defects from test synchronization, locator, state-isolation, or environment issues.
- Make the smallest change that addresses the root cause; do not hide failures with broad retries or longer global timeouts.
- Preserve the intended assertions and report any product defect rather than weakening the test.
- Rerun the affected test and relevant checks; summarize the cause, fix, and verification.
