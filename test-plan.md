# Test Plan: Sauce Demo

**Application under test:** https://www.saucedemo.com (practice e-commerce site)
**Tester:** SQA Portfolio
**Type:** Manual functional testing

## Scope
In scope: login, product listing and sorting, cart, checkout, logout.
Out of scope: performance, security, payment processing (the site has none).

## Test data
| User | Password | Behaviour |
|---|---|---|
| standard_user | secret_sauce | Normal user |
| locked_out_user | secret_sauce | Blocked at login |
| problem_user | secret_sauce | Known UI defects |

## Environment
Chrome (latest), Windows 10, 1920x1080.

## Entry / exit criteria
- Entry: site reachable, test data available.
- Exit: all test cases executed, all Critical/High defects reported.

## Deliverables
- `test-cases.csv` — executed test cases with results
- `bug-reports.md` — defects found

## Risks
Public demo site may change or be unavailable.
