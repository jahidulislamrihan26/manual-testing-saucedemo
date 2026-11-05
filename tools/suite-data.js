// Source of truth for the manual test suite. Run `npm run build` to regenerate the Excel/CSV/Markdown outputs.
// Every status below was observed during the execution session on 2026-11-05 (Chrome 1366x768, plus 375x667 for mobile).

const EXEC_DATE = '2026-11-05';

const requirements = [
  ['REQ-01', 'Authentication', 'Users can log in with valid credentials; invalid, empty and locked accounts are rejected with a clear message.', 'High'],
  ['REQ-02', 'Session & access control', 'Pages require login; logout ends the session; direct URL access is blocked.', 'High'],
  ['REQ-03', 'Product catalogue', 'Six products are shown with correct name, price, image and detail page.', 'High'],
  ['REQ-04', 'Sorting', 'Products can be sorted by name and price in both directions.', 'Medium'],
  ['REQ-05', 'Shopping cart', 'Items can be added and removed; the cart badge and buttons reflect cart state.', 'High'],
  ['REQ-06', 'Checkout information', 'Checkout requires valid customer details and a non-empty cart.', 'Critical'],
  ['REQ-07', 'Order calculation', 'Item total, 8% tax and grand total are calculated correctly.', 'Critical'],
  ['REQ-08', 'Order completion', 'A valid order can be completed and the cart is cleared.', 'Critical'],
  ['REQ-09', 'Navigation', 'Menu, footer and back-navigation links work.', 'Medium'],
  ['REQ-10', 'Responsive UI', 'Layout is usable on desktop and mobile widths with no visual defects.', 'Medium'],
  ['REQ-11', 'Accessibility', 'Basic accessibility: titles, language, alt text, keyboard operation.', 'Medium'],
  ['REQ-12', 'Browser compatibility', 'Works on current Chrome, Firefox, Edge and Safari.', 'Medium'],
  ['REQ-13', 'Security hardening', 'Sessions cannot be forged, cookies are protected, traffic uses HTTPS, standard security headers are sent.', 'Critical'],
  ['REQ-14', 'URL handling and navigation state', 'Typing a URL or using the Back button never shows a false confirmation, never repeats an order, and unknown pages explain themselves.', 'High'],
];

const USERS = {
  std: 'standard_user / secret_sauce',
  lock: 'locked_out_user / secret_sauce',
  prob: 'problem_user / secret_sauce',
  err: 'error_user / secret_sauce',
  vis: 'visual_user / secret_sauce',
  perf: 'performance_glitch_user / secret_sauce',
};

// [id, req, module, title, type, priority, preconditions, testData, steps, expected, actual, status, defect, evidence]
const T = (...a) => ({
  id: a[0], req: a[1], module: a[2], title: a[3], type: a[4], priority: a[5], pre: a[6], data: a[7],
  steps: a[8], expected: a[9], actual: a[10], status: a[11], defect: a[12] || '', evidence: a[13] || '',
});

const cases = [
  // ---- Authentication
  T('TC-001', 'REQ-01', 'Login', 'Login with valid credentials', 'Functional', 'Critical', 'Login page open', USERS.std, '1. Enter username\n2. Enter password\n3. Click Login', 'Products page opens at /inventory.html', 'Products page opened with 6 items', 'Pass', '', 'standard-products.png'),
  T('TC-002', 'REQ-01', 'Login', 'Login as locked-out user', 'Negative', 'High', 'Login page open', USERS.lock, '1. Enter locked_out_user credentials\n2. Click Login', 'Error "Sorry, this user has been locked out."', 'Error shown exactly as expected', 'Pass', '', 'locked-out.png'),
  T('TC-003', 'REQ-01', 'Login', 'Login with wrong password', 'Negative', 'High', 'Login page open', 'standard_user / wrong_pw', '1. Enter username\n2. Enter wrong password\n3. Click Login', 'Error "Username and password do not match any user in this service"', 'Error shown; user stayed on login page', 'Pass', '', 'login-error.png'),
  T('TC-004', 'REQ-01', 'Login', 'Login with empty username', 'Negative', 'Medium', 'Login page open', 'username empty / secret_sauce', '1. Leave username empty\n2. Enter password\n3. Click Login', 'Error "Username is required"', 'Error "Username is required" shown', 'Pass'),
  T('TC-005', 'REQ-01', 'Login', 'Login with empty password', 'Negative', 'Medium', 'Login page open', 'standard_user / empty', '1. Enter username\n2. Leave password empty\n3. Click Login', 'Error "Password is required"', 'Error "Password is required" shown', 'Pass'),
  T('TC-006', 'REQ-01', 'Login', 'Login with both fields empty', 'Negative', 'Medium', 'Login page open', 'empty / empty', '1. Click Login with both fields empty', 'Error "Username is required"', 'Error "Username is required" shown', 'Pass'),
  T('TC-007', 'REQ-01', 'Login', 'Username is case sensitive', 'Boundary', 'Medium', 'Login page open', 'Standard_User / secret_sauce', '1. Enter username with capital letters\n2. Enter valid password\n3. Click Login', 'Login rejected with credential-mismatch error', 'Login rejected with credential-mismatch error', 'Pass'),
  T('TC-008', 'REQ-01', 'Login', 'Username with leading space', 'Boundary', 'Low', 'Login page open', '" standard_user" / secret_sauce', '1. Enter a space before the username\n2. Click Login', 'Login rejected', 'Login rejected with credential-mismatch error', 'Pass'),
  T('TC-009', 'REQ-01', 'Login', 'SQL injection string in username', 'Security', 'High', 'Login page open', "' OR 1=1 -- / x", "1. Enter the injection string as username\n2. Enter any password\n3. Click Login", 'Login rejected; no stack trace or database error shown', 'Generic credential-mismatch error only', 'Pass'),
  T('TC-010', 'REQ-01', 'Login', 'Password field masks input', 'Security', 'High', 'Login page open', 'any', '1. Type in the password field', 'Characters are masked (input type=password)', 'Field type is password; characters masked', 'Pass'),
  T('TC-011', 'REQ-01', 'Login', 'Enter key submits login form', 'Usability', 'Low', 'Login page open', USERS.std, '1. Fill both fields\n2. Press Enter in password field', 'Form submits and Products page opens', 'Products page opened', 'Pass'),
  T('TC-012', 'REQ-01', 'Login', 'Error banner can be dismissed', 'Usability', 'Low', 'Error banner visible', 'empty form', '1. Click Login with empty form\n2. Click X on the red banner', 'Banner disappears', 'Banner disappeared', 'Pass'),
  T('TC-013', 'REQ-11', 'Login', 'Keyboard tab order on login form', 'Accessibility', 'Medium', 'Login page open', 'n/a', '1. Press Tab repeatedly from page load', 'Focus moves username -> password -> Login', 'Focus reached username, then password, in order', 'Pass'),
  T('TC-014', 'REQ-01', 'Login', 'performance_glitch_user sees products within 3 s of logging in', 'Performance', 'Medium', 'Login page open', USERS.perf, '1. Log in as performance_glitch_user\n2. Time from clicking Login until the product list is visible', 'Product list visible within 3 s (standard_user: about 0.15 s)', 'Product list appeared after about 5.1 s on repeated measurements (standard_user: 0.14 to 0.17 s). The URL changes at once but the page content is delayed.', 'Fail', 'BUG-012', ''),
  // ---- Session
  T('TC-015', 'REQ-02', 'Session', 'Direct URL access without login is blocked', 'Security', 'Critical', 'Not logged in', 'n/a', '1. Open /inventory.html directly in a new session', 'Redirected to login with an access error', 'Login page shown with "You can only access \'/inventory.html\' when you are logged in."', 'Pass', '', 'direct-access-error.png'),
  T('TC-016', 'REQ-02', 'Session', 'Back button after logout does not reveal account', 'Security', 'High', 'Logged in', USERS.std, '1. Log out\n2. Click browser Back', 'Login page with access error; no product data', 'Login page shown with access error', 'Pass', '', 'back-after-logout.png'),
  T('TC-017', 'REQ-02', 'Session', 'Logout returns to login page', 'Functional', 'Medium', 'Logged in', USERS.std, '1. Open menu\n2. Click Logout', 'Login page shown', 'Login page shown', 'Pass'),
  T('TC-018', 'REQ-02', 'Session', 'Cart contents after logout and login', 'Functional', 'Low', 'Item in cart', USERS.std, '1. Add Backpack\n2. Logout\n3. Login again', 'Behaviour is defined (cart cleared or kept)', 'Cart badge still showed 1 (kept). Observation: confirm this is intended.', 'Pass'),
  // ---- Catalogue
  T('TC-019', 'REQ-03', 'Products', 'Six products with name and price', 'Functional', 'Critical', 'Logged in', USERS.std, '1. Open Products page', '6 products: Backpack 29.99, Bike Light 9.99, Bolt T-Shirt 15.99, Fleece Jacket 49.99, Onesie 7.99, Test.allTheThings() T-Shirt 15.99', 'Exact list and prices matched', 'Pass', '', 'standard-products.png'),
  T('TC-020', 'REQ-11', 'Products', 'Product images have alt text', 'Accessibility', 'Medium', 'Logged in', USERS.std, '1. Inspect each product image alt attribute', 'Each image has meaningful alt text', 'All 6 images have alt text equal to the product name', 'Pass'),
  T('TC-021', 'REQ-03', 'Products', 'Product detail page opens', 'Functional', 'High', 'Logged in', USERS.std, '1. Click first product name', 'Detail page for that product opens', 'Opened /inventory-item.html?id=4', 'Pass', '', 'product-detail.png'),
  T('TC-022', 'REQ-03', 'Products', 'problem_user sees correct product images', 'UI', 'Medium', 'Logged in', USERS.prob, '1. Open Products page', 'Each product shows its own image', 'All 6 products show the same placeholder image', 'Fail', 'BUG-004', 'problem-user-products.png'),
  T('TC-023', 'REQ-03', 'Products', 'visual_user prices match standard_user', 'UI', 'High', 'Logged in', USERS.vis, '1. Open Products page\n2. Compare prices to TC-019', 'Prices identical to TC-019', 'Prices differ (Backpack $50.36, Bike Light $4.24, Bolt T-Shirt $7.02, Fleece Jacket $63.96)', 'Fail', 'BUG-011', 'visual-user-products.png'),
  // ---- Sorting
  T('TC-024', 'REQ-04', 'Sorting', 'Default sort is Name A to Z', 'Functional', 'Low', 'Logged in', USERS.std, '1. Open Products page', 'Sort control shows Name (A to Z); list alphabetical', 'Default Name (A to Z)', 'Pass'),
  T('TC-025', 'REQ-04', 'Sorting', 'Sort Name Z to A', 'Functional', 'Medium', 'Logged in', USERS.std, '1. Select Name (Z to A)', 'Test.allTheThings() first ... Backpack last', 'Order matched', 'Pass'),
  T('TC-026', 'REQ-04', 'Sorting', 'Sort Price low to high', 'Functional', 'Medium', 'Logged in', USERS.std, '1. Select Price (low to high)', 'Onesie 7.99 first ... Fleece Jacket 49.99 last', 'Order matched', 'Pass'),
  T('TC-027', 'REQ-04', 'Sorting', 'Sort Price high to low', 'Functional', 'Medium', 'Logged in', USERS.std, '1. Select Price (high to low)', 'Fleece Jacket first ... Onesie last', 'Order matched', 'Pass'),
  T('TC-028', 'REQ-04', 'Sorting', 'problem_user can sort Z to A', 'Functional', 'Medium', 'Logged in', USERS.prob, '1. Select Name (Z to A)', 'List reorders Z to A', 'List order did not change', 'Fail', 'BUG-005'),
  T('TC-029', 'REQ-04', 'Sorting', 'error_user can sort Z to A', 'Functional', 'Medium', 'Logged in', USERS.err, '1. Select Name (Z to A)', 'List reorders Z to A', 'Alert "Sorting is broken! This error has been reported to Backtrace." shown', 'Fail', 'BUG-008'),
  // ---- Cart
  T('TC-030', 'REQ-05', 'Cart', 'Add one item to cart', 'Functional', 'Critical', 'Logged in', USERS.std, '1. Click Add to cart on Backpack', 'Badge shows 1; button changes to Remove', 'Badge 1; button Remove', 'Pass'),
  T('TC-031', 'REQ-05', 'Cart', 'Remove item from cart', 'Functional', 'Critical', 'One item in cart', USERS.std, '1. Click Remove', 'Badge disappears; button reverts to Add to cart', 'Badge removed; button reverted', 'Pass'),
  T('TC-032', 'REQ-05', 'Cart', 'Add two items and see both in cart', 'Functional', 'High', 'Logged in', USERS.std, '1. Add Backpack and Bike Light\n2. Open cart', 'Both items listed', 'Both listed; overview totals included both', 'Pass'),
  T('TC-033', 'REQ-05', 'Cart', 'Reset App State clears cart badge', 'Functional', 'Medium', 'Item in cart', USERS.std, '1. Add Backpack\n2. Menu > Reset App State', 'Cart badge cleared', 'Badge cleared', 'Pass'),
  T('TC-034', 'REQ-05', 'Cart', 'Reset App State restores product buttons', 'Functional', 'Medium', 'Item in cart', USERS.std, '1. Add Backpack\n2. Menu > Reset App State\n3. Look at Backpack button', 'Button reverts to Add to cart', 'Button still showed Remove while cart was empty', 'Fail', 'BUG-003', 'reset-state-bug.png'),
  T('TC-035', 'REQ-05', 'Cart', 'problem_user can add every product', 'Functional', 'High', 'Logged in', USERS.prob, '1. Click Add to cart on all six products', 'Each button changes to Remove', 'No change for Bolt T-Shirt, Fleece Jacket, Test.allTheThings() T-Shirt', 'Fail', 'BUG-006', 'problem-user-remove.png'),
  T('TC-036', 'REQ-05', 'Cart', 'problem_user can remove an added product', 'Functional', 'High', 'Item added', USERS.prob, '1. Add Backpack\n2. Click Remove', 'Button reverts to Add to cart', 'Button stayed Remove for Backpack, Bike Light, Onesie', 'Fail', 'BUG-006', 'problem-user-remove.png'),
  T('TC-037', 'REQ-05', 'Cart', 'error_user can add every product', 'Functional', 'High', 'Logged in', USERS.err, '1. Add each of the first five products', 'Each button changes to Remove', 'No change for Bolt T-Shirt and Fleece Jacket', 'Fail', 'BUG-009'),
  // ---- Checkout
  T('TC-038', 'REQ-06', 'Checkout', 'Checkout is blocked when cart is empty', 'Negative', 'Critical', 'Empty cart', USERS.std, '1. Open cart\n2. Click Checkout\n3. Enter valid details\n4. Click Continue', 'Checkout prevented with a message', 'Reached the overview page with Total $0.00', 'Fail', 'BUG-001', 'empty-cart-checkout-allowed.png'),
  T('TC-039', 'REQ-06', 'Checkout', 'Missing first name', 'Negative', 'Medium', 'Checkout step one', 'first name empty', '1. Leave first name empty\n2. Click Continue', 'Error "First Name is required"', 'Error shown', 'Pass'),
  T('TC-040', 'REQ-06', 'Checkout', 'Missing last name', 'Negative', 'Medium', 'Checkout step one', 'last name empty', '1. Fill first name and ZIP\n2. Click Continue', 'Error "Last Name is required"', 'Error shown', 'Pass'),
  T('TC-041', 'REQ-06', 'Checkout', 'Missing postal code', 'Negative', 'Medium', 'Checkout step one', 'ZIP empty', '1. Fill both names\n2. Click Continue', 'Error "Postal Code is required"', 'Error shown', 'Pass'),
  T('TC-042', 'REQ-06', 'Checkout', 'Postal code with letters and symbols is rejected', 'Boundary', 'Medium', 'Item in cart', 'ZIP "abc!@#" and "-1"', '1. Enter ZIP abc!@#\n2. Click Continue', 'Validation error', 'Accepted; moved to overview', 'Fail', 'BUG-002', 'checkout-invalid-zip-accepted.png'),
  T('TC-043', 'REQ-06', 'Checkout', 'Whitespace-only fields are rejected', 'Boundary', 'Medium', 'Item in cart', '3 spaces in each field', '1. Enter 3 spaces in each field\n2. Click Continue', '"required" errors', 'Accepted; moved to overview', 'Fail', 'BUG-002'),
  T('TC-044', 'REQ-06', 'Checkout', '300-character first name is limited', 'Boundary', 'Low', 'Item in cart', '300 x "A"', '1. Enter 300 characters in first name\n2. Click Continue', 'Length limit or validation error', 'Accepted; moved to overview', 'Fail', 'BUG-002'),
  T('TC-045', 'REQ-09', 'Checkout', 'Cancel on checkout step one', 'Functional', 'Low', 'Checkout step one', USERS.std, '1. Click Cancel', 'Returns to a previous shopping page', 'Returned to Products page. Observation: many shops return to cart.', 'Pass'),
  T('TC-046', 'REQ-06', 'Checkout', 'problem_user can enter last name', 'Functional', 'High', 'Checkout step one', USERS.prob, '1. Type Test / User / 12345\n2. Click Continue', 'All three fields keep their values', 'Last name text went into the first name field; error "Last Name is required"', 'Fail', 'BUG-007', 'problem-user-checkout.png'),
  T('TC-047', 'REQ-08', 'Checkout', 'error_user can finish an order', 'Functional', 'Critical', 'Overview page', USERS.err, '1. Complete checkout details\n2. Click Finish', 'Order confirmation page', 'Stayed on overview page; order not placed', 'Fail', 'BUG-010', 'error-user-finish.png'),
  // ---- Order calculation / completion
  T('TC-048', 'REQ-07', 'Order', 'Item total equals sum of prices', 'Functional', 'Critical', 'Backpack + Bike Light in cart', USERS.std, '1. Go to checkout overview', 'Item total $39.98', 'Item total: $39.98', 'Pass', '', 'checkout-overview.png'),
  T('TC-049', 'REQ-07', 'Order', 'Tax is 8% of item total', 'Functional', 'Critical', 'Same as TC-048', USERS.std, '1. Read tax on overview', 'Tax $3.20 (39.98 x 0.08 = 3.1984, rounded)', 'Tax: $3.20', 'Pass', '', 'checkout-overview.png'),
  T('TC-050', 'REQ-07', 'Order', 'Total equals item total plus tax', 'Functional', 'Critical', 'Same as TC-048', USERS.std, '1. Read total on overview', 'Total $43.18', 'Total: $43.18', 'Pass', '', 'checkout-overview.png'),
  T('TC-051', 'REQ-08', 'Order', 'Complete an order', 'Functional', 'Critical', 'Item in cart', USERS.std, '1. Checkout with valid details\n2. Click Finish', 'Message "Thank you for your order!"', 'Message shown', 'Pass', '', 'order-complete.png'),
  T('TC-052', 'REQ-08', 'Order', 'Cart is empty after order', 'Functional', 'High', 'Order just completed', USERS.std, '1. Complete an order\n2. Check cart badge', 'Badge cleared', 'Badge cleared', 'Pass'),
  T('TC-053', 'REQ-09', 'Order', 'Back Home returns to Products', 'Functional', 'Low', 'Order complete page', USERS.std, '1. Click Back Home', 'Products page opens', 'Products page opened', 'Pass'),
  // ---- Navigation
  T('TC-054', 'REQ-09', 'Navigation', 'About link target', 'Functional', 'Low', 'Logged in, menu open', USERS.std, '1. Inspect About menu link', 'Points to saucelabs.com', 'href = https://saucelabs.com/ (link target checked, not opened)', 'Pass'),
  T('TC-055', 'REQ-09', 'Navigation', 'Footer social links', 'Functional', 'Low', 'Logged in', USERS.std, '1. Inspect footer links', 'X, Facebook, LinkedIn links present', 'Three links present with saucelabs targets (targets checked, not opened)', 'Pass'),
  // ---- Responsive, accessibility, compatibility
  T('TC-056', 'REQ-10', 'UI', 'Desktop layout 1366x768', 'UI', 'Medium', 'Logged in', USERS.std, '1. Open Products at 1366x768', 'Two-column grid, nothing clipped', 'Layout correct', 'Pass', '', 'standard-products.png'),
  T('TC-057', 'REQ-10', 'UI', 'Mobile layout 375x667 has no horizontal scroll', 'UI', 'Medium', 'Logged in', USERS.std, '1. Open Products at 375x667', 'Single column; no horizontal scroll', 'Single column; no horizontal scroll', 'Pass', '', 'mobile-products.png'),
  T('TC-058', 'REQ-10', 'UI', 'visual_user layout is aligned', 'UI', 'Medium', 'Logged in', USERS.vis, '1. Open Products page', 'Header, cart icon and titles aligned like standard_user', 'Cart icon misplaced, product titles shifted, Fleece Jacket image cropped, Backpack image differs', 'Fail', 'BUG-011', 'visual-user-products.png'),
  T('TC-059', 'REQ-11', 'Accessibility', 'Page has title and language', 'Accessibility', 'Medium', 'Any page', 'n/a', '1. Check <title> and <html lang>', 'Both present', 'Title "Swag Labs", lang "en" (title is identical on every page)', 'Pass'),
  T('TC-060', 'REQ-11', 'Accessibility', 'WCAG A/AA scan incl. colour contrast on all main pages', 'Accessibility', 'Medium', 'Logged in', 'axe-core, rules wcag2a, wcag2aa, wcag21a, wcag21aa', '1. Scan login, products, product detail, cart, checkout step 1, step 2 and complete pages', 'No violations; all text meets 4.5:1 contrast', '0 violations on all 7 pages, colour-contrast included. A manual screen-reader check was not done.', 'Pass'),
  T('TC-061', 'REQ-12', 'Compatibility', 'Chrome latest', 'Compatibility', 'High', 'n/a', 'Chrome (Chromium)', '1. Run the full suite', 'All core flows work', 'All core flows work (defects listed separately)', 'Pass'),
  T('TC-062', 'REQ-12', 'Compatibility', 'Firefox latest', 'Compatibility', 'Medium', 'n/a', 'Firefox (Playwright build)', '1. Run smoke subset TC-001, 030, 051', 'Same result as Chrome', 'All 69 automated UI tests passed on Firefox in CI run 41989789403, covering login, cart and the full purchase. Verified by automation, not by hand.', 'Pass'),
  T('TC-063', 'REQ-12', 'Compatibility', 'Edge latest', 'Compatibility', 'Medium', 'n/a', 'Microsoft Edge 156.0.4314.58 (installed browser)', '1. Run smoke subset TC-001, 030, 051 in Edge', 'Same result as Chrome', 'In real Edge 156: login, 6 products shown, add to cart (badge 1), checkout and "Thank you for your order!" all worked.', 'Pass', '', 'edge-order-complete.png'),
  T('TC-064', 'REQ-12', 'Compatibility', 'Safari engine (WebKit) latest', 'Compatibility', 'Low', 'n/a', 'WebKit (Playwright build)', '1. Run smoke subset TC-001, 030, 051', 'Same result as Chrome', 'All 69 automated UI tests passed on WebKit in CI run 41989789403. This is the Safari engine; Safari on macOS and iOS itself was not available.', 'Pass'),
  // ---- Added in the second review: security, URL handling, keyboard, edge cases
  T('TC-065', 'REQ-13', 'Security', 'Session cannot be forged by setting a cookie', 'Security', 'Critical', 'Not logged in', 'cookie session-username=standard_user', '1. In a fresh browser add the cookie session-username=standard_user for www.saucedemo.com\n2. Open /inventory.html', 'Redirected to the login page', 'Shop opened as standard_user with no password. The same cookie with problem_user also worked; only locked_out_user was turned away.', 'Fail', 'BUG-013', 'forged-cookie-access.png'),
  T('TC-066', 'REQ-13', 'Security', 'Session cookie is HttpOnly and Secure', 'Security', 'High', 'Logged in', USERS.std, '1. Log in\n2. Inspect the session-username cookie', 'HttpOnly and Secure are set; value is not a readable username', 'Value is the plain username; HttpOnly false, Secure false, SameSite Lax', 'Fail', 'BUG-013', ''),
  T('TC-067', 'REQ-13', 'Security', 'Session cookie has a limited lifetime', 'Security', 'Medium', 'Logged in', USERS.std, '1. Log in\n2. Read the cookie expiry', 'Cookie expires after a limited time', 'Expires after about 10 minutes (expiry itself was not waited out)', 'Pass'),
  T('TC-068', 'REQ-13', 'Security', 'Plain HTTP is redirected to HTTPS', 'Security', 'High', 'n/a', 'http://www.saucedemo.com/', '1. Request the HTTP address without following redirects', '301 or 308 redirect to https://', '301 redirect to https://www.saucedemo.com/', 'Pass'),
  T('TC-069', 'REQ-13', 'Security', 'Standard security headers are sent', 'Security', 'Medium', 'n/a', 'curl -I https://www.saucedemo.com/', '1. Read response headers', 'Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, frame protection and Referrer-Policy present', 'Only Server and Cache-Control present; none of the five security headers', 'Fail', 'BUG-018', ''),
  T('TC-070', 'REQ-13', 'Security', 'Script text in a product URL is not executed', 'Security', 'High', 'Logged in', '/inventory-item.html?id=<script>alert(1)</script>', '1. Open the address with script text in the id parameter', 'Script does not run; safe error state', 'No script ran; "ITEM NOT FOUND" page shown', 'Pass'),
  T('TC-071', 'REQ-14', 'URL handling', 'Invalid product ids do not crash or reveal data', 'Negative', 'Medium', 'Logged in', 'ids 999, abc, -1, and no id', '1. Open /inventory-item.html with each id', 'A not-found state, no crash', '"ITEM NOT FOUND" page for all four, page still usable', 'Pass', '', 'detail-invalid-id.png'),
  T('TC-072', 'REQ-14', 'URL handling', 'Not-found pages give a clear, helpful message', 'Usability', 'Low', 'Logged in', '/nonexistent-page.html and ?id=999', '1. Open an unknown address\n2. Open a product with an unknown id', 'Plain-language message and a way back', 'Unknown address returns a blank page (HTTP 404, no text). The product not-found page uses telephone wording: "your call could not be completed as dialled. Please check your number".', 'Fail', 'BUG-019', 'detail-invalid-id.png'),
  T('TC-073', 'REQ-14', 'URL handling', 'Order confirmation cannot be opened without an order', 'Negative', 'High', 'Logged in, empty cart, no order placed', '/checkout-complete.html', '1. Open /checkout-complete.html directly', 'Redirect to the cart or products page', 'Page says "Thank you for your order! Your order has been dispatched" although no order was placed', 'Fail', 'BUG-014', 'direct-complete-no-order.png'),
  T('TC-074', 'REQ-14', 'URL handling', 'Checkout overview cannot be opened directly with an empty cart', 'Negative', 'High', 'Logged in, empty cart', '/checkout-step-two.html', '1. Open /checkout-step-two.html directly', 'Redirect to the cart', 'Overview opens with Total $0.00 and a working Finish button', 'Fail', 'BUG-015', 'direct-step2-empty-cart.png'),
  T('TC-075', 'REQ-14', 'URL handling', 'Back button after an order does not allow submitting it again', 'Negative', 'High', 'Order just placed', USERS.std, '1. Place an order\n2. Click the browser Back button\n3. Click Finish', 'Overview not shown again, or Finish does nothing', 'Overview page returns with Total $0.00; Finish shows the confirmation again', 'Fail', 'BUG-015', 'back-after-order.png'),
  T('TC-076', 'REQ-05', 'Cart', 'All six products can be added', 'Boundary', 'Medium', 'Logged in', USERS.std, '1. Click Add to cart on every product', 'Badge shows 6', 'Badge showed 6', 'Pass'),
  T('TC-077', 'REQ-07', 'Order', 'Totals are correct for all six products', 'Functional', 'High', 'All six products in cart', USERS.std, '1. Go to the checkout overview', 'Item total $129.94, tax $10.40 (10.3952 rounded), total $140.34', 'Item total $129.94, tax $10.40, total $140.34', 'Pass'),
  T('TC-078', 'REQ-05', 'Cart', 'Double-click on Add to cart leaves the cart consistent', 'Boundary', 'Low', 'Logged in', USERS.std, '1. Double-click Add to cart on Backpack', 'Cart and button agree (second click is a Remove)', 'Item added then removed; badge gone and button back to Add to cart: consistent', 'Pass'),
  T('TC-079', 'REQ-05', 'Cart', 'Adding from a product page is reflected in the list', 'Functional', 'Medium', 'Logged in', USERS.std, '1. Open Bike Light\n2. Click Add to cart\n3. Click Back to products', 'Badge 1 and the list button shows Remove', 'Badge 1; Bike Light button showed Remove', 'Pass'),
  T('TC-080', 'REQ-04', 'Sorting', 'Sort choice is kept after viewing a product', 'Usability', 'Low', 'Logged in', USERS.std, '1. Sort by Price (high to low)\n2. Open a product\n3. Click Back to products', 'Still sorted high to low', 'Sort reset to Name (A to Z)', 'Fail', 'BUG-017', ''),
  T('TC-081', 'REQ-11', 'Accessibility', 'Tab order on the products page is logical', 'Accessibility', 'Medium', 'Logged in', USERS.std, '1. Press Tab repeatedly from page load', 'Menu, sort, then image link, name link and Add button of each product in order', 'Order matched exactly', 'Pass'),
  T('TC-082', 'REQ-11', 'Accessibility', 'Add to cart works with the Enter key', 'Accessibility', 'Medium', 'Logged in', USERS.std, '1. Focus the Add to cart button of Onesie\n2. Press Enter', 'Item added', 'Item added; button became Remove', 'Pass'),
  T('TC-083', 'REQ-11', 'Accessibility', 'Escape closes the side menu', 'Accessibility', 'Low', 'Logged in', USERS.std, '1. Open the menu\n2. Press Escape', 'Menu closes', 'Menu closed', 'Pass'),
  T('TC-084', 'REQ-11', 'Accessibility', 'Keyboard focus is clearly visible', 'Accessibility', 'High', 'Logged in', USERS.std, '1. Press Tab until the Add to cart button is focused\n2. Look at the button', 'A visible focus indicator (WCAG 2.4.7)', 'Focused button looks the same as an unfocused one: outline none, no shadow, no colour change', 'Fail', 'BUG-016', 'keyboard-focus.png'),
  T('TC-085', 'REQ-10', 'UI', 'Layout at 320 and 480 px wide', 'UI', 'Medium', 'Logged in', USERS.std, '1. Open Products at 320x640\n2. Repeat at 480x640', 'No horizontal scroll', 'No horizontal scroll at either width', 'Pass', '', 'width-320.png'),
];

// Defects
const D = (...a) => ({ id: a[0], title: a[1], severity: a[2], priority: a[3], module: a[4], kind: a[5], user: a[6], steps: a[7], expected: a[8], actual: a[9], evidence: a[10], tcs: a[11], note: a[12] || '' });
const SEEDED = 'Seeded by the site: the practice site builds these failures into the named user so testers can practise reporting them. Logged as if found in a real product.';

const defects = [
  D('BUG-001', 'Checkout can be started and completed with an empty cart', 'Major', 'High', 'Checkout', 'Genuine', USERS.std,
    '1. Log in as standard_user\n2. Click the cart icon (cart is empty)\n3. Click Checkout\n4. Enter First Test, Last User, ZIP 12345\n5. Click Continue',
    'Checkout is blocked with a message such as "Your cart is empty".', 'Checkout step two opens with Total: $0.00 and a Finish button.', 'empty-cart-checkout-allowed.png', 'TC-038'),
  D('BUG-002', 'Checkout form has no input validation beyond "required"', 'Major', 'Medium', 'Checkout', 'Genuine', USERS.std,
    '1. Add any product and start checkout\n2. Enter first name of 300 "A", last name "<script>alert(1)</script>", ZIP "-1" (also tried "abc!@#" and three spaces in each field)\n3. Click Continue',
    'Invalid ZIP, whitespace-only values and excessive length are rejected with a field error.', 'All variants accepted and checkout moved to the overview page. (Output encoding of the script text was not examined.)', 'checkout-invalid-zip-accepted.png', 'TC-042, TC-043, TC-044'),
  D('BUG-003', 'Reset App State clears the cart badge but leaves product buttons on "Remove"', 'Minor', 'Medium', 'Cart', 'Genuine', USERS.std,
    '1. Log in as standard_user\n2. Click Add to cart on Sauce Labs Backpack\n3. Open the menu and click Reset App State\n4. Look at the Backpack button',
    'Cart badge cleared and button back to "Add to cart".', 'Badge cleared but the button still reads "Remove" while the cart is empty. The user cannot re-add the item without a page reload.', 'reset-state-bug.png', 'TC-034'),
  D('BUG-004', 'Every product shows the same placeholder image for problem_user', 'Minor', 'Medium', 'Products', 'Seeded', USERS.prob,
    '1. Log in as problem_user\n2. Look at the images on the Products page', 'Each product shows its own image.', 'All six products show one placeholder image.', 'problem-user-products.png', 'TC-022', SEEDED),
  D('BUG-005', 'Sorting has no effect for problem_user', 'Major', 'Medium', 'Sorting', 'Seeded', USERS.prob,
    '1. Log in as problem_user\n2. Choose Name (Z to A) in the sort menu', 'Products reorder Z to A.', 'Order stays A to Z.', 'problem-user-products.png', 'TC-028', SEEDED),
  D('BUG-006', 'Add and Remove buttons fail on several products for problem_user', 'Critical', 'High', 'Cart', 'Seeded', USERS.prob,
    '1. Log in as problem_user\n2. Click Add to cart on Bolt T-Shirt, Fleece Jacket and Test.allTheThings() T-Shirt\n3. Add Backpack, Bike Light and Onesie, then click Remove on each', 'Add changes the button to Remove; Remove changes it back.', 'Add does nothing for the first three products. Remove does nothing for the last three.', 'problem-user-remove.png', 'TC-035, TC-036', SEEDED),
  D('BUG-007', 'Last Name text is typed into the First Name field for problem_user', 'Critical', 'High', 'Checkout', 'Seeded', USERS.prob,
    '1. Log in as problem_user and add Backpack\n2. Start checkout\n3. Type Test / User / 12345 into the three fields\n4. Click Continue', 'Each field keeps its own value and checkout continues.', 'Last Name stays empty, First Name shows "User", error "Last Name is required". Checkout cannot be completed.', 'problem-user-checkout.png', 'TC-046', SEEDED),
  D('BUG-008', 'Sorting shows an error alert for error_user', 'Major', 'Medium', 'Sorting', 'Seeded', USERS.err,
    '1. Log in as error_user\n2. Choose Name (Z to A)', 'Products reorder.', 'Alert: "Sorting is broken! This error has been reported to Backtrace." and the order is unchanged.', 'n/a (browser alert)', 'TC-029', SEEDED),
  D('BUG-009', 'Add to cart does nothing on two products for error_user', 'Major', 'High', 'Cart', 'Seeded', USERS.err,
    '1. Log in as error_user\n2. Click Add to cart on Bolt T-Shirt and Fleece Jacket', 'Buttons change to Remove and the badge increases.', 'No change in the button or badge.', 'n/a', 'TC-037', SEEDED),
  D('BUG-010', 'Order cannot be completed for error_user', 'Critical', 'High', 'Checkout', 'Seeded', USERS.err,
    '1. Log in as error_user and add a product that can be added\n2. Complete checkout details and click Continue\n3. Click Finish', 'Order confirmation page.', 'Stays on checkout step two; order is not placed.', 'error-user-finish.png', 'TC-047', SEEDED),
  D('BUG-011', 'visual_user sees different prices and a broken layout', 'Major', 'High', 'Products', 'Seeded', USERS.vis,
    '1. Log in as visual_user\n2. Compare the Products page with standard_user', 'Same prices and layout.', 'Prices differ (Backpack $50.36 vs $29.99, Bike Light $4.24 vs $9.99, Bolt T-Shirt $7.02 vs $15.99, Fleece Jacket $63.96 vs $49.99), cart icon misplaced, titles shifted, Fleece Jacket image cropped.', 'visual-user-products.png', 'TC-023, TC-058', SEEDED),
];

defects.push(
  D('BUG-012', 'Product list appears about 5 seconds after login for performance_glitch_user', 'Major', 'Medium', 'Login', 'Seeded', USERS.perf,
    '1. Open the login page\n2. Log in as performance_glitch_user\n3. Time from clicking Login until the product list is visible (measured three times)', 'Product list visible within 3 s, like standard_user (about 0.15 s).', 'The address changes immediately but the product list appears after about 5.1 s (measured: 5.13 s, 5.15 s, and a 5.1 s block on the click itself).', 'n/a (timing, see automation test BUG-012)', 'TC-014', SEEDED + ' An earlier timing of this user only watched the address bar and wrongly reported no delay; it was corrected after the automation suite measured when the content actually appears.'),
);

// Found in the second review (security, URL handling, keyboard use, edge cases). All are Genuine: they happen in the normal
// standard_user flow. The site is a client-side practice shop, so some are by design of the site; they are logged as if found in a real product.
const GENUINE_NOTE = 'Logged as if found in a real product. The practice shop has no server behind its login, so this is how it is built, but a real shop with this behaviour would have the stated impact.';
defects.push(
  D('BUG-013', 'Login can be bypassed by forging an unsigned session cookie', 'Critical', 'High', 'Security', 'Genuine', 'none (no password needed)',
    '1. Open a fresh private window on https://www.saucedemo.com (not logged in)\n2. In the browser tools add a cookie for www.saucedemo.com: name session-username, value standard_user, path /\n3. Open https://www.saucedemo.com/inventory.html',
    'Redirected to the login page. A session must be proven with a password and be an unguessable, signed value, with HttpOnly and Secure set.',
    'The shop opens as standard_user with no password. The same works for problem_user (and any other username); only locked_out_user is turned away. The cookie holds the plain username, HttpOnly is false, Secure is false, SameSite is Lax, lifetime about 10 minutes.',
    'forged-cookie-access.png', 'TC-065, TC-066', 'Impact if real: anyone who knows or guesses a username can act as that user, and script on the page can read or steal the cookie. ' + GENUINE_NOTE),
  D('BUG-014', 'Order confirmation page can be opened without placing an order', 'Major', 'Medium', 'Checkout', 'Genuine', USERS.std,
    '1. Log in as standard_user with an empty cart\n2. Open https://www.saucedemo.com/checkout-complete.html directly',
    'Redirected to the cart or products page.', 'The page shows "Thank you for your order! Your order has been dispatched" although no order exists.',
    'direct-complete-no-order.png', 'TC-073', 'Impact if real: false confirmation screens, wrong support calls and misleading analytics. ' + GENUINE_NOTE),
  D('BUG-015', 'Checkout overview can be opened with an empty cart and an order can be submitted again with the Back button', 'Major', 'High', 'Checkout', 'Genuine', USERS.std,
    'A. 1. Log in with an empty cart\n   2. Open https://www.saucedemo.com/checkout-step-two.html directly\nB. 1. Place a normal order\n   2. Click the browser Back button\n   3. Click Finish',
    'A: redirected to the cart. B: the overview is not shown again, or Finish does nothing.',
    'A: overview opens with Total $0.00 and a working Finish button. B: the overview returns with Total $0.00 and Finish shows the confirmation again, so a second (empty) order is accepted. Related to BUG-001.',
    'back-after-order.png', 'TC-074, TC-075', 'Impact if real: empty and duplicate orders. ' + GENUINE_NOTE),
  D('BUG-016', 'Keyboard focus is not visible on buttons and the sort menu', 'Major', 'Medium', 'Accessibility', 'Genuine', USERS.std,
    '1. Log in as standard_user\n2. Press Tab until the Add to cart button of Backpack is focused (or the sort menu)\n3. Compare it with an unfocused button',
    'A clear focus indicator is shown (WCAG 2.1 success criterion 2.4.7, level AA).',
    'The focused control looks identical to an unfocused one: computed outline-style none, no box-shadow, no colour change. Keyboard users cannot tell where they are. The automated axe scan does not detect this, it was found by testing with the keyboard.',
    'keyboard-focus.png', 'TC-084', 'Impact if real: the shop is hard or impossible to use for keyboard-only users, which is also a legal risk in many countries. ' + GENUINE_NOTE),
  D('BUG-017', 'Chosen sort order is lost after viewing a product', 'Minor', 'Low', 'Sorting', 'Genuine', USERS.std,
    '1. Log in and choose Price (high to low)\n2. Open any product\n3. Click Back to products',
    'The list is still sorted high to low.', 'The sort resets to Name (A to Z).', 'n/a (visible in the sort menu)', 'TC-080', 'Impact if real: shoppers must re-sort after every product they open. ' + GENUINE_NOTE),
  D('BUG-018', 'No standard security headers are sent', 'Minor', 'Medium', 'Security', 'Genuine', 'n/a (any request)',
    '1. Run: curl -I https://www.saucedemo.com/\n2. Read the response headers',
    'Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options (or frame-ancestors) and Referrer-Policy are present.',
    'Only Server (GitHub.com) and Cache-Control are sent; none of the five security headers. Plain HTTP does redirect to HTTPS (301), which is good.',
    'n/a (response headers)', 'TC-069', 'Impact if real: weaker protection against clickjacking, content sniffing and script injection. The site is on a static host, which may limit what can be set. ' + GENUINE_NOTE),
  D('BUG-019', 'Unknown addresses show a blank page and the product not-found page uses telephone wording', 'Minor', 'Low', 'Navigation', 'Genuine', USERS.std,
    '1. Open https://www.saucedemo.com/nonexistent-page.html\n2. Open https://www.saucedemo.com/inventory-item.html?id=999',
    'A plain-language "page not found" message with a link back to the shop.',
    '1: a blank page (HTTP 404, no text). 2: "ITEM NOT FOUND - We\'re sorry, but your call could not be completed as dialled. Please check your number, and try your call again." (wording for a phone line, not a web shop).',
    'detail-invalid-id.png', 'TC-072', 'Impact if real: confusing dead ends for shoppers. ' + GENUINE_NOTE),
);

module.exports = { EXEC_DATE, requirements, cases, defects };
