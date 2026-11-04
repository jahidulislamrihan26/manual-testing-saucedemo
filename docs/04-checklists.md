# Quick-Check Checklists

Legend: ✅ checked and OK, ❌ checked and failed, ⬜ not checked.

## Accessibility (WCAG 2.1 AA, basic)
| Check | Result | Note |
|---|---|---|
| Page has a `<title>` | ✅ | "Swag Labs" |
| `<html lang>` set | ✅ | `en` |
| Product images have alt text | ✅ | All 6 |
| Page title changes per page | ❌ | Same on every page (minor, open question) |
| Login form tab order is logical | ✅ | username, password |
| Whole checkout usable by keyboard only | ⬜ | Not run |
| Colour contrast 4.5:1 | ⬜ | Needs analyser |
| Screen-reader announcement of errors | ⬜ | Needs screen reader |
| Visible focus indicator | ⬜ | Not inspected |

## Usability
| Check | Result |
|---|---|
| Error messages say what to fix | ✅ |
| Error banner can be dismissed | ✅ |
| Enter key submits login | ✅ |
| Cart count visible at all times | ✅ |
| Cancel behaviour predictable | ⬜ (open question) |
| Empty-cart state explained | ❌ (checkout allowed with no message) |

## Basic security
| Check | Result |
|---|---|
| Password masked | ✅ |
| Protected URL blocked without login | ✅ |
| Back button after logout safe | ✅ |
| Injection text in login handled | ✅ |
| Script text in checkout fields | ⬜ Accepted; output encoding not examined |
| Session expiry | ⬜ Not run |

## Compatibility
| Browser | Result |
|---|---|
| Chrome latest | ✅ full suite |
| Mobile viewport 375x667 (Chrome emulation) | ✅ no horizontal scroll |
| Firefox latest | ⬜ Not run |
| Edge latest | ⬜ Not run |
| Safari latest | ⬜ Not run |
