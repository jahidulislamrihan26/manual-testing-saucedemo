# Test Plan: Sauce Demo

Version 1.0, 2026-11-05. Read together with the [test strategy](01-test-strategy.md).

## 1. Items under test
Swag Labs web application at https://www.saucedemo.com. No build number is exposed; the date of execution identifies the version.

## 2. Features to be tested
| Feature | Requirement | Test cases |
|---|---|---|
| Authentication | REQ-01 | TC-001 to TC-014 |
| Session and access control | REQ-02 | TC-015 to TC-018 |
| Product catalogue | REQ-03 | TC-019 to TC-023 |
| Sorting | REQ-04 | TC-024 to TC-029 |
| Cart | REQ-05 | TC-030 to TC-037 |
| Checkout information | REQ-06 | TC-038 to TC-047 |
| Order calculation and completion | REQ-07, REQ-08 | TC-048 to TC-053 |
| Navigation | REQ-09 | TC-045, TC-053 to TC-055 |
| Responsive UI | REQ-10 | TC-056 to TC-058, TC-085 |
| Accessibility | REQ-11 | TC-013, TC-020, TC-059, TC-060, TC-081 to TC-084 |
| Browser compatibility | REQ-12 | TC-061 to TC-064 |
| Security hardening | REQ-13 | TC-065 to TC-070 |
| URL handling and navigation state | REQ-14 | TC-071 to TC-075 |
| Extra cart, order and sorting checks | REQ-04, REQ-05, REQ-07 | TC-076 to TC-080 |

## 3. Test data
| User | Password | Purpose |
|---|---|---|
| standard_user | secret_sauce | Baseline, expected-correct behaviour |
| locked_out_user | secret_sauce | Must be refused at login |
| problem_user | secret_sauce | Site seeds image, sort, cart and form faults |
| error_user | secret_sauce | Site seeds sort alert, cart and finish-order faults |
| visual_user | secret_sauce | Site seeds price and layout faults |
| performance_glitch_user | secret_sauce | Site simulates slow responses |

Checkout data: `Test / User / 12345`. Boundary data: 3 spaces, 300 x "A", `-1`, `abc!@#`, `<script>alert(1)</script>`, `' OR 1=1 --`.

## 4. Schedule and effort (planning estimate)
These are estimates for a tester starting this scope from scratch. They are **not** hours actually logged.

| Activity | Estimated effort |
|---|---|
| Analysis and requirement derivation | 1 hour |
| Test case design | 3 hours |
| Execution (functional) | 2 hours |
| Exploratory sessions (3 x 45 min) | 2.25 hours |
| Defect reporting | 1.5 hours |
| Reporting | 1 hour |

## 5. Roles
| Role | Responsibility |
|---|---|
| Test lead | Strategy, plan, sign-off recommendation |
| Tester | Design, execution, defect reporting |
| Developer (not engaged) | Triage and fix defects |
| Product owner (not engaged) | Confirm intended behaviour for observations |

## 6. Open questions for the product owner
1. Should the cart persist after logout and login? It currently does (TC-018).
2. Should **Cancel** on checkout step one return to the cart or to Products? It currently returns to Products (TC-045).
3. Should the page title change per page? It is "Swag Labs" everywhere (TC-059).

## 7. Suspension and resumption
Testing stops if the site is unreachable or login fails for standard_user; it resumes when standard_user can log in again.

## 8. Sign-off (left blank for the client to complete)
| Role | Name | Date |
|---|---|---|
| Test lead | | |
| Product owner | | |
