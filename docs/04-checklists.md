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
| Products page tab order is logical | ✅ | menu, sort, then image link, name link, Add button per product |
| Add to cart usable with Enter | ✅ | |
| Escape closes the side menu | ✅ | |
| Automated scan (axe, WCAG A and AA) | ✅ | 0 violations on login, products, product detail, cart, checkout 1, checkout 2, complete |
| Colour contrast 4.5:1 | ✅ | Part of the axe scan, no violations |
| Visible keyboard focus indicator | ❌ | None on buttons or sort menu (BUG-016) |
| Cart reachable with Tab and openable with Enter | ❌ | Never receives focus; Enter and Space do nothing (BUG-020) |
| Whole checkout usable by keyboard only | ❌ | Blocked by the cart link (BUG-020) |
| Screen-reader announcement of errors | ⬜ | Needs a screen reader |

## Usability
| Check | Result |
|---|---|
| Error messages say what to fix | ✅ |
| Error banner can be dismissed | ✅ |
| Enter key submits login | ✅ |
| Cart count visible at all times | ✅ |
| Cancel behaviour predictable | ⬜ (open question) |
| Empty-cart state explained | ❌ (checkout allowed with no message) |
| Sort choice kept after viewing a product | ❌ (BUG-017) |
| Not-found pages are helpful | ❌ (BUG-019) |

## Security
| Check | Result |
|---|---|
| Password masked | ✅ |
| Protected URL blocked without login | ✅ |
| Back button after logout safe | ✅ |
| Injection text in login handled | ✅ |
| Session cannot be forged | ❌ plain-username cookie opens the shop (BUG-013) |
| Session cookie HttpOnly and Secure | ❌ (BUG-013) |
| Session cookie has an expiry | ✅ about 10 minutes (expiry not waited out) |
| HTTP redirects to HTTPS | ✅ 301 |
| Security headers sent | ❌ none of the five standard ones (BUG-018) |
| Script text in a product URL not executed | ✅ |
| Script text in checkout fields | ⬜ Accepted; output encoding not examined |

## Compatibility
| Browser | Result |
|---|---|
| Chrome latest | ✅ full suite by hand |
| Microsoft Edge 156 (real, installed) | ✅ full purchase by hand |
| Firefox latest | ✅ via automated suite in CI (all 69 tests), not by hand |
| WebKit (Safari engine) | ✅ via automated suite in CI (all 69 tests), not by hand |
| Safari on macOS and iOS | ⬜ no Apple device available |
| Mobile viewport 375x667, 480x640, 320x640 | ✅ no horizontal scroll |
