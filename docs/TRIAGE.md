# Flaky cart test triage

## Findings ranked by impact

1. **Blocker — tests depend on execution order and shared state.** The second test
   opens `/cart.html` without creating a cart in that test. It passes only if the
   first test ran first and the application retained its state.
2. **Blocker — the global `cartCount` makes parallel execution unsafe.** Shared
   mutable state can be overwritten by another test and makes outcomes dependent
   on worker scheduling.
3. **Suggestion — the fixed three-second wait is a race, not synchronization.**
   A slow CI run can still be too slow; a fast run wastes time. Assert on the
   resulting UI state instead.
4. **Suggestion — the absolute XPath is coupled to page layout.** Prefer a
   product-scoped role or test-id locator so markup changes do not silently target
   a different control.
5. **Suggestion — `locator.count()` counts matching elements, not the cart badge's
   displayed quantity.** Assert on the badge text or cart contents to verify the
   intended result.
6. **Nit — `force: true` bypasses Playwright's actionability checks.** Keep normal
   clicks so overlays and disabled controls surface as actionable failures.

## Mentoring review comments

- **[blocker]** Please make each test create its own cart item. The checkout test
  currently assumes the preceding test's state, so it fails when run alone or in
  a different order.
- **[blocker]** Please remove the shared `cartCount` variable. The browser and
  assertions should own state within each test to remain safe under parallel workers.
- **[suggestion]** Replace the fixed sleep with a web-first assertion for the cart
  badge or cart row. That waits for the actual condition and is more reliable in CI.
- **[suggestion]** Scope the add-to-cart button to the named product and locate it
  by role. This is clearer and less sensitive to inventory layout changes.
- **[nit]** Avoid `force: true` here. A normal click gives useful feedback if the
  button is covered or unavailable.

The corrected independent example is
[`tests/triage/flaky-cart.spec.ts`](../tests/triage/flaky-cart.spec.ts).
