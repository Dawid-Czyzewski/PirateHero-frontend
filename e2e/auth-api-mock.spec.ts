import { test, expect } from '@playwright/test';

test.describe('Play / auth with mocked public API', () => {
  test('login success against stubbed backend', async ({ page }) => {
    await page.route('**/api/login', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            token: 'e2e-access',
            refresh_token: 'e2e-refresh',
            user: { id: 'e2e-user' },
          },
          meta: {},
        }),
      });
    });

    await page.goto('/auth');
    await page.getByRole('textbox', { name: /email/i }).fill('e2e@test.local');
    await page.getByRole('textbox', { name: /^password$/i }).fill('password');
    await page.getByRole('button', { name: /log in|login|zaloguj/i }).click();

    await expect(page.getByText(/You have successfully logged in|zalogowa/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test('activation route tolerates mocked GET', async ({ page }) => {
    await page.route('**/api/activate-account/**', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { ok: true }, meta: {} }),
      });
    });

    await page.goto('/activateAccount/fake-token-e2e');
    await expect(
      page.getByText(/activated|aktywowane|konto/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
