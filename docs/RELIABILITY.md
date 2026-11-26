# Reliability run

The application suites were run separately with
`--repeat-each=5 --workers=4`:

| App            | Repeated test executions | Result                                                            |
| -------------- | -----------------------: | ----------------------------------------------------------------- |
| Sauce Demo     |                       55 | Passed; the problem-user defect is marked as an expected failure. |
| TodoMVC        |                       15 | Passed.                                                           |
| Restful Booker |                       40 | Passed on the final full run.                                     |

During the first API repeat run, one PUT request received HTTP 405 while the
remaining 39 executions passed. The PUT case then passed five isolated repetitions,
and the complete API repeat run passed 40/40. The transient response was not
reproducible, so no client retry or relaxed assertion was added; transient service
behavior remains an external risk.

The cart triage test is independent: it creates its own authenticated context,
adds one product, and asserts the resulting cart contents using web-first
expectations. No fixed sleeps or shared cart state are used.
