import { expect, test } from '../../../fixtures/auth.fixture';
import { CartPage } from '../../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../../pages/saucedemo/CheckoutPage';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';

test.use({ userRole: 'standard_user' });

test.beforeEach(async ({ page }) => {
  await page.goto('/inventory.html');
});

test('completes a purchase from the cart @smoke @saucedemo', async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await inventory.addToCart('Sauce Labs Backpack');
  await inventory.openCart();
  await cart.proceedToCheckout();
  await checkout.fillInformation({
    firstName: 'Taylor',
    lastName: 'QA',
    postalCode: '10001',
  });
  await checkout.continue();

  await expect(checkout.summaryTotal).toContainText(/\$\d+\.\d{2}/);
  await checkout.finish();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
});

test('requires checkout information before continuing @regression @saucedemo', async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await inventory.addToCart('Sauce Labs Backpack');
  await inventory.openCart();
  await cart.proceedToCheckout();
  await checkout.continue();

  await expect(checkout.errorMessage).toContainText('First Name is required');
});
