# Manual Testing Project: Sauce Demo E-commerce

A complete manual test package for https://www.saucedemo.com, built the way a QA team would hand it to a client.

## Result in one look
| | |
|---|---|
| Test cases | **85** across 14 requirements, all traced, all executed |
| Results | 60 pass, 25 fail (70.6%) |
| Defects | **19** with steps and evidence (10 genuine, 9 seeded by the site's test users) |
| Key findings | Login can be bypassed with a forged cookie (Critical); checkout accepts empty carts, false confirmations and repeat orders; keyboard focus is invisible |
| Recommendation | **Not ready for release** as a real shop (exit rule not met) |
| Also verified | Real Edge 156, automated accessibility scan of 7 pages (clean), HTTP to HTTPS redirect, 320 px layout |

## What is inside
| Deliverable | File |
|---|---|
| Test strategy (approach, risk-based priorities, exit criteria) | [docs/01-test-strategy.md](docs/01-test-strategy.md) |
| Test plan (scope, data, schedule, open questions) | [docs/02-test-plan.md](docs/02-test-plan.md) |
| Exploratory testing charters with session notes | [docs/03-exploratory-charters.md](docs/03-exploratory-charters.md) |
| Accessibility, usability, security, compatibility checklists | [docs/04-checklists.md](docs/04-checklists.md) |
| **Test summary report** (start here) | [docs/05-test-summary-report.md](docs/05-test-summary-report.md) |
| Excel workbook: dashboard, test cases, traceability matrix, defect log | [test-suite/SauceDemo-Test-Suite.xlsx](test-suite/SauceDemo-Test-Suite.xlsx) |
| Test cases as CSV | [test-suite/test-cases.csv](test-suite/test-cases.csv) |
| Defect reports and log | [defects/](defects) |
| Screenshot evidence | [evidence/](evidence) |

## Skills shown
Requirement derivation and traceability, risk-based test design, equivalence partitioning, boundary analysis, negative and security-minded testing, exploratory charters, persona-based testing, severity and priority judgement, evidence-based defect reporting, clear reporting of what was **not** tested.

## Rebuild the workbook
```bash
cd tools
npm install
npm run build
```
Edit `tools/suite-data.js` to change cases, defects or results; the workbook, CSVs, defect pages and metrics regenerate.
