import type { Locator, Page } from '@playwright/test';

export interface CheckoutInformation {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  get summaryTotal(): Locator {
    return this.page.getByTestId('total-label');
  }

  async fillInformation(information: CheckoutInformation): Promise<void> {
    await this.page.getByTestId('firstName').fill(information.firstName);
    await this.page.getByTestId('lastName').fill(information.lastName);
    await this.page.getByTestId('postalCode').fill(information.postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByTestId('continue').click();
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click();
  }
}
