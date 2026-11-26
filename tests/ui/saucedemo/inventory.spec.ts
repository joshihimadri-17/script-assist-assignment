import { expect, test } from '../../../fixtures/auth.fixture';
import { CartPage } from '../../../pages/saucedemo/CartPage';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';
import { parseCurrency } from '../../../utils/helpers';

test.use({ userRole: 'standard_user' });

test.beforeEach(async ({ page }) => {
  await page.goto('/inventory.html');
});

test('sorts inventory by product name @smoke @saucedemo', async ({ page }) => {
  const inventory = new InventoryPage(page);

  await inventory.sortBy('az');
  const namesAscending = await inventory.getProductNames();
  expect(namesAscending).toEqual([...namesAscending].sort((a, b) => a.localeCompare(b)));

  await inventory.sortBy('za');
  const namesDescending = await inventory.getProductNames();
  expect(namesDescending).toEqual([...namesDescending].sort((a, b) => b.localeCompare(a)));
});

test('sorts inventory by price @regression @saucedemo', async ({ page }) => {
  const inventory = new InventoryPage(page);

  await inventory.sortBy('lohi');
  const prices = (await inventory.getProductPrices()).map(parseCurrency);

  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('adds and removes an item from the cart @smoke @saucedemo', async ({ page }) => {
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);

  await inventory.addToCart('Sauce Labs Backpack');
  await inventory.openCart();
  await expect(cart.items).toHaveCount(1);

  await cart.removeItem('Sauce Labs Backpack');
  await expect(cart.items).toHaveCount(0);
});
