import type { Locator, Page } from '@playwright/test';

export type InventorySort = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  get title(): Locator {
    return this.page.getByTestId('title');
  }

  get inventoryItems(): Locator {
    return this.page.getByTestId('inventory-item');
  }

  async sortBy(order: InventorySort): Promise<void> {
    await this.page.getByTestId('product-sort-container').selectOption(order);
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItems.getByTestId('inventory-item-name').allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return this.inventoryItems.getByTestId('inventory-item-price').allTextContents();
  }

  async getProductImageSources(): Promise<string[]> {
    return this.inventoryItems
      .getByRole('img')
      .evaluateAll((images) => images.map((image) => image.getAttribute('src') ?? ''));
  }

  async addToCart(productName: string): Promise<void> {
    await this.product(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromInventory(productName: string): Promise<void> {
    await this.product(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  private product(name: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
  }
}
