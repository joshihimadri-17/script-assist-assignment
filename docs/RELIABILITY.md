# Reliability run

Executed on 2026-11-26 with four workers and five repetitions per selected case:

| App / scope                                        |        Executions | Observed result                                                                                                       |
| -------------------------------------------------- | ----------------: | --------------------------------------------------------------------------------------------------------------------- |
| Sauce Demo UI                                      | 60 (12 cases x 5) | Playwright reported 60 passed. The known `problem_user` image defect was an expected failure in all five repetitions. |
| TodoMVC UI                                         |  25 (5 cases x 5) | 25 passed.                                                                                                            |
| Restful Booker API, credential-free negative cases |  10 (2 cases x 5) | 10 passed.                                                                                                            |

The Restful Booker CRUD and authenticated tests were not run because
`RESTFUL_BOOKER_USERNAME` and `RESTFUL_BOOKER_PASSWORD` were not configured in the
local environment. The API result above is only for the malformed-payload and
non-existent-booking cases; it is not a full API-suite result.

The malformed booking payload returned HTTP 500 with a plain-text
`Internal Server Error` response in the observed run. The test asserts that exact
behavior; it documents the demo service response and does not imply that HTTP 500
is desirable input validation.

The flaky-cart triage case passed in all five Sauce Demo repetitions. It creates its
own authenticated context, adds one product, and checks the resulting cart using a
web-first assertion.
