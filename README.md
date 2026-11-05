# Manual Testing Project: Sauce Demo E-commerce

A complete manual test package for https://www.saucedemo.com, built the way a QA team would hand it to a client.

## Result in one look
| | |
|---|---|
| Test cases | **64** across 12 requirements, all traced |
| Executed | 60 (93.8%): 44 pass, 16 fail |
| Defects | **12** with steps and evidence (3 genuine, 9 seeded by the site's test users) |
| Key finding | Checkout accepts an empty cart and invalid data |
| Recommendation | Conditional go: fix BUG-001 first |

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
Requirement derivation and traceability, risk-based test design, equivalence partitioning, boundary analysis, negative and security-minded testing, exploratory charters, persona-based testing, severity and priority judgement, evidence-based defect reporting, honest reporting of what was **not** tested.

## A note on honesty
Four cases are marked **Not Run** (three browsers and a contrast tool) because they were not available. They are listed, not assumed to pass. Nine of the defects are failures the practice site builds into its special users (problem, error, visual, performance_glitch); they are labelled **Seeded** and kept apart from the three **Genuine** defects when judging release readiness.

## Rebuild the workbook
```bash
cd tools
npm install
npm run build
```
Edit `tools/suite-data.js` to change cases, defects or results; the workbook, CSVs, defect pages and metrics regenerate.
