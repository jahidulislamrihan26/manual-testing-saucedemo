# Exploratory Testing Charters

Format: **Explore** a target **with** resources **to discover** information. Session notes record what was actually tried and found on 2026-11-05.

---

## Charter 1: Checkout resilience
**Explore** the checkout flow **with** unusual and extreme inputs and an unusual cart state **to discover** missing validation and broken business rules.

**Areas covered:** cart to checkout navigation, the three form fields, overview page, cancel.

| Idea tried | Result |
|---|---|
| Checkout with an empty cart | Allowed; overview shows $0.00. **BUG-001** |
| ZIP `abc!@#` and `-1` | Accepted. **BUG-002** |
| Three spaces in every field | Accepted. **BUG-002** |
| 300-character first name | Accepted. **BUG-002** |
| `<script>` text in last name | Accepted (rendering on overview not examined) |
| Only first name filled | "Last Name is required" shown (good) |
| Cancel from step one | Returns to Products, not cart (logged as an open question) |

**Risks and questions raised:** an empty-cart order could create zero-value orders in a real back end. Does the server validate, or only the page?

---

## Charter 2: Session and access control
**Explore** login, logout, direct URLs and the browser Back button **with** a clean browser session **to discover** ways to reach protected pages or keep stale state.

| Idea tried | Result |
|---|---|
| Open `/inventory.html` without logging in | Redirected to login with a clear message (good) |
| Log out then press Back | Login page with message; no product data shown (good) |
| Add item, log out, log back in | Cart still contains the item. Observation, needs product-owner decision |
| Reset App State while on products page | Badge clears, buttons still say "Remove". **BUG-003** |
| Credentials with different case or leading space | Rejected (good) |
| SQL-injection text in username | Generic error only (good) |

**Risks and questions raised:** cart persistence across sessions could leak a previous user's choices on a shared computer.

---

## Charter 3: Persona users
**Explore** the six built-in user accounts **with** the same task each time (log in, sort, add to cart, check out) **to discover** behaviour that differs from standard_user.

| User | Findings |
|---|---|
| locked_out_user | Refused with correct message (good) |
| performance_glitch_user | The address changes at once, but the product list appears after about 5.1 s (standard_user: about 0.15 s). **BUG-012**. (First timing here only watched the address bar and missed this; corrected after repeat measurements.) |
| problem_user | Same image on all products (**BUG-004**), sort ignored (**BUG-005**), some Add/Remove buttons dead (**BUG-006**), last name typed into first name (**BUG-007**) |
| error_user | Sort alert (**BUG-008**), two products cannot be added (**BUG-009**), order cannot be finished (**BUG-010**) |
| visual_user | Different prices and shifted layout (**BUG-011**) |

**Follow-up ideas not yet run:** performance_glitch_user timing on later pages (cart, checkout; the delay may recur there), a full keyboard-only purchase, a screen-reader pass, Safari on a real Apple device.

---

## Charter 4: How is a login proven?
**Explore** the session, cookies and addresses **with** browser developer tools and a second clean browser profile **to discover** whether an account can be reached without its password.

| Idea tried | Result |
|---|---|
| Inspect the cookie set after login | `session-username=standard_user`: plain username, not HttpOnly, not Secure, SameSite Lax, lives about 10 minutes |
| Copy that cookie into a fresh browser, open `/inventory.html` | Shop opens with no password. **BUG-013** (Critical) |
| Same with `problem_user` | Works; only `locked_out_user` is turned away |
| HTTP address | Redirects (301) to HTTPS (good) |
| Response headers | No HSTS, CSP, X-Content-Type-Options, frame protection or Referrer-Policy. **BUG-018** |
| Script text in a product URL | Not executed (good) |

**Risks and questions raised:** any user could impersonate another by changing one cookie; if there is no server-side check, the same is true for orders and personal data in a real shop.

---

## Charter 5: What can you do with addresses and the Back button?
**Explore** checkout and confirmation pages **with** typed addresses, the Back button and unusual order of steps **to discover** states a shopper should never reach.

| Idea tried | Result |
|---|---|
| Open `/checkout-complete.html` with no order | "Thank you for your order!" shown. **BUG-014** |
| Open `/checkout-step-two.html` with an empty cart | Overview with Total $0.00 and a Finish button. **BUG-015** |
| Place an order, press Back, press Finish | Overview returns; Finish accepts a second, empty order. **BUG-015** |
| Product page with unknown id, text id, negative id, no id | "ITEM NOT FOUND" page, no crash (good), but telephone wording. **BUG-019** |
| Unknown address | Blank page with HTTP 404 and no text. **BUG-019** |
| Sort by price high to low, open a product, go back | Sort reset to A to Z. **BUG-017** |
| Double-click Add to cart | Item added then removed; state stays consistent (good) |

**Risks and questions raised:** these are all ways a real customer could get a false receipt or a double order.

---

## Charter 6: Can the shop be used without a mouse?
**Explore** the products, cart and menu **with** the keyboard only **to discover** blockers for people who cannot use a mouse.

| Idea tried | Result |
|---|---|
| Tab through the products page | Order is logical: menu, sort, then image link, name link and Add button for each product (good) |
| Press Enter on Add to cart | Item added (good) |
| Press Escape with the menu open | Menu closes (good) |
| Look at the focused button | No visible change: outline none, no shadow, no colour change. **BUG-016** |
| Automated axe scan on 7 pages | 0 violations (good), but this scan cannot see the missing focus style |

**Risks and questions raised:** automated scans alone gave a clean result while a real keyboard problem existed, which is the reason to keep manual keyboard checks in the plan.
