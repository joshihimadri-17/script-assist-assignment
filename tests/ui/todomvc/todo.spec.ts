import { expect, test } from '@playwright/test';
import { TodoPage } from '../../../pages/todomvc/TodoPage';

test.beforeEach(async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();
});

test('creates a todo @smoke @todomvc', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.addTodo('Review framework setup');

  await expect(todoPage.getTodo('Review framework setup')).toBeVisible();
  await expect(todoPage.items).toHaveCount(1);
});

test('marks a todo complete @regression @todomvc', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.addTodo('Validate API contract');
  await todoPage.toggleTodo('Validate API contract');

  await expect(todoPage.getTodo('Validate API contract')).toHaveClass(/completed/);
});

test('deletes a todo @regression @todomvc', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.addTodo('Remove temporary task');
  await todoPage.deleteTodo('Remove temporary task');

  await expect(todoPage.items).toHaveCount(0);
});
