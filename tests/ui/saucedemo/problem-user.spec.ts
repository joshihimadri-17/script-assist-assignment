import { expect, test } from '../../../fixtures/auth.fixture';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';

test.use({ userRole: 'problem_user' });

test('problem user shows a distinct image for every product @regression @saucedemo', async ({
  page,
}) => {
  test.fail(true, 'Known defect: problem_user displays incorrect/repeated product images.');
  await page.goto('/inventory.html');

  const inventory = new InventoryPage(page);
  const imageSources = await inventory.getProductImageSources();

  expect(new Set(imageSources).size).toBe(imageSources.length);
});
