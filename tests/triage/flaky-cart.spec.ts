import { expect, test } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';

test.use({ userRole: 'standard_user' });

test('adds one product and verifies it in the cart @smoke @saucedemo', async ({ page }) => {
  await page.goto('/inventory.html');

  const inventory = new InventoryPage(page);
  await inventory.addToCart('Sauce Labs Backpack');
  await inventory.openCart();

  const cart = new CartPage(page);
  await expect(cart.items).toHaveCount(1);
  await expect(cart.items).toContainText('Sauce Labs Backpack');
});
