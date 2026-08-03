import { test, expect } from '@playwright/test';

test.describe('Public auth entry', () => {
  test('/auth shows auth flow', async ({ page }) => {
    await page.goto('/auth');
    await expect(
      page.getByRole('button', { name: /log in|login|zaloguj/i }).first()
    ).toBeVisible();
  });

  test('can switch to registration', async ({ page }) => {
    await page.goto('/auth');
    await page
      .getByRole('tab', { name: /zarejestruj|sign up|register|rejestracja|registration/i })
      .click();
    await expect(page.getByRole('textbox', { name: /repeat password|powtórz hasło/i })).toBeVisible();
  });
});
