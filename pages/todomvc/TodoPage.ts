import type { Locator, Page } from '@playwright/test';

export class TodoPage {
  constructor(private readonly page: Page) {}

  get todoInput(): Locator {
    return this.page.getByRole('textbox', { name: 'What needs to be done?' });
  }

  get items(): Locator {
    return this.page.getByTestId('todo-item');
  }

  async goto(): Promise<void> {
    await this.page.goto('');
  }

  async addTodo(title: string): Promise<void> {
    await this.todoInput.fill(title);
    await this.todoInput.press('Enter');
  }

  async toggleTodo(title: string): Promise<void> {
    await this.getTodo(title).getByRole('checkbox').check();
  }

  async showActiveTodos(): Promise<void> {
    await this.page.getByRole('link', { name: 'Active', exact: true }).click();
  }

  async showCompletedTodos(): Promise<void> {
    await this.page.getByRole('link', { name: 'Completed', exact: true }).click();
  }

  async deleteTodo(title: string): Promise<void> {
    const item = this.getTodo(title);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  getTodo(title: string): Locator {
    return this.items.filter({ hasText: title });
  }
}
