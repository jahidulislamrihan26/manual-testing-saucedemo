# Test Strategy: Sauce Demo (Swag Labs)

| | |
|---|---|
| Document version | 1.0 |
| Date | 2026-11-05 |
| Application under test | https://www.saucedemo.com (public practice e-commerce site) |
| Test type | Manual functional, exploratory, usability, basic accessibility and security checks |

## 1. Objective
Give stakeholders an evidence-based answer to: **is the shopping flow (login, browse, cart, checkout) safe to release, and what are the risks if not?**

## 2. Approach
The site has no written specification, so requirements were derived from observed behaviour and normal e-commerce expectations. They are listed as REQ-01 to REQ-12 and each is traced to test cases in the [traceability matrix](../test-suite/SauceDemo-Test-Suite.xlsx) (sheet "Traceability").

| Technique | Where used |
|---|---|
| Requirements-based testing | Every REQ has at least 3 test cases |
| Equivalence partitioning | Login (valid, wrong, empty, locked), sort options |
| Boundary value analysis | Checkout fields (empty, whitespace, 300 characters, negative ZIP) |
| Negative testing | Wrong credentials, empty cart checkout, blocked access |
| Exploratory testing | Three charters in [03-exploratory-charters.md](03-exploratory-charters.md) |
| Persona-based testing | The site's six built-in users (standard, locked_out, problem, error, visual, performance_glitch) |
| Experience-based checklists | Accessibility, usability, compatibility in [04-checklists.md](04-checklists.md) |

## 3. Scope
**In scope:** login and logout, session protection, product list and detail, sorting, cart, three-step checkout, order calculation, menu and footer links, desktop and mobile widths, basic accessibility, basic input-security checks.

**Out of scope:** load and stress testing (covered in the separate `performance-testing` project), automated regression (the `automation-testing` project), real payments (none exist), penetration testing, localisation.

## 4. Risk-based prioritisation
Priority comes from impact on revenue multiplied by likelihood of failure.

| Risk | Impact | Likelihood | Rating | Test focus |
|---|---|---|---|---|
| Customer cannot complete an order | Very high | Medium | **Critical** | TC-038 to TC-052 |
| Wrong totals or prices charged | Very high | Low | **High** | TC-023, TC-048 to TC-050 |
| Unauthorised access to pages | High | Low | **High** | TC-015, TC-016 |
| Cart state wrong or lost | High | Medium | **High** | TC-030 to TC-037 |
| Login failures lock customers out | High | Low | **High** | TC-001 to TC-014 |
| Bad data accepted at checkout | Medium | High | **High** | TC-042 to TC-044 |
| Layout or sorting problems | Medium | Medium | Medium | TC-024 to TC-029, TC-056 to TC-058 |
| Browser-specific issues | Medium | Medium | Medium | TC-061 to TC-064 |

## 5. Test levels and entry/exit criteria
- **Entry:** site reachable, six test users available, test environment documented.
- **Exit:** every Critical and High test case executed; every failure logged as a defect with steps and evidence; summary report issued.
- **Release recommendation rule:** no open Critical defect in a standard-user flow, and no more than two open Major defects.

## 6. Defect management
- Severity: **Critical** (core flow impossible or data/money wrong), **Major** (feature broken, workaround exists), **Minor** (cosmetic or low impact).
- Priority: High, Medium, Low (business urgency).
- Each defect has its own page in [`defects/`](../defects) with steps, expected and actual result and a screenshot.
- Origin is recorded: **Genuine** (real behaviour of the site's normal flow) or **Seeded** (failure the site builds into a named test user on purpose). Both are reported so the process can be shown end to end, but only Genuine defects count towards the release recommendation.

## 7. Test environment
| Item | Value |
|---|---|
| Browser | Chrome (Chromium), latest at execution date |
| Viewports | 1366x768 desktop, 375x667 mobile |
| Network | Normal broadband |
| Test data | See [02-test-plan.md](02-test-plan.md) |

## 8. Deliverables
Test strategy, test plan, 64 test cases with traceability matrix, defect log and 11 defect reports with evidence, exploratory charters, checklists, test summary report.

## 9. Assumptions and constraints
- Public demo site may change; results are valid for 2026-11-05.
- Only Chrome was available in the execution session; Firefox, Edge and Safari cases are listed and marked **Not Run** rather than assumed to pass.
- No assistive technology (screen reader) or contrast tool was used.
