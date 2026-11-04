# Bug Reports

## BUG-001: All products show the same image for problem_user
- **Severity:** Medium  **Priority:** Medium
- **Environment:** Chrome latest, Windows 10
- **Linked test case:** TC-015
- **Steps:**
  1. Go to https://www.saucedemo.com
  2. Login as `problem_user` / `secret_sauce`
  3. Look at the product images on the Products page
- **Expected:** Each product shows its own image.
- **Actual:** Every product shows the same dog image.

## BUG-002: Remove button does nothing on Products page for problem_user
- **Severity:** Medium  **Priority:** Medium
- **Linked test case:** TC-016
- **Steps:**
  1. Login as `problem_user`
  2. Click Add to cart on any product
  3. Click Remove on the same product
- **Expected:** Item is removed and button changes back to "Add to cart".
- **Actual:** Button stays as "Remove" and the item stays in the cart.

> Note: These behaviours are intentional defects built into the practice site, used here to show defect reporting.
