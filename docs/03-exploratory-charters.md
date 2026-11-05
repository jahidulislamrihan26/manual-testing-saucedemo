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

**Follow-up ideas not yet run:** performance_glitch_user timing on later pages (cart, checkout; the delay may recur there), keyboard-only checkout, screen-reader pass, Firefox and Safari smoke tests.
