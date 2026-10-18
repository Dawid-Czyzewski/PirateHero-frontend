import { expect, test } from "@playwright/test";

const widths = [390, 768, 1024, 1440] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "fl-cookie-consent",
      JSON.stringify({ necessary: true, analytics: false, marketing: false }),
    );
  });
});

for (const width of widths) {
  test(`landing przy ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("complementary", { name: "Trailer gry" })).toBeVisible();

    const fighter = page.getByRole("img", { name: "Zawodnik Freak Legends w stroju MMA" });
    if (width < 768) {
      await expect(fighter).toBeHidden();
    } else {
      await expect(fighter).toBeVisible();
    }

    if (width >= 1024) {
      const nav = page.getByRole("navigation", { name: "Główne" });
      const home = nav.getByRole("link", { name: "Strona główna" });
      const box = await home.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeLessThan(48);

      const headline = page.getByRole("img", { name: /Zostań legendą/ });
      const headlineBox = await headline.boundingBox();
      const fighterBox = await fighter.boundingBox();
      expect(headlineBox).not.toBeNull();
      expect(fighterBox).not.toBeNull();
      const overlap = Math.max(
        0,
        Math.min(headlineBox!.x + headlineBox!.width, fighterBox!.x + fighterBox!.width) -
          Math.max(headlineBox!.x, fighterBox!.x),
      );
      expect(overlap).toBeLessThan(headlineBox!.width * 0.35);
    }
  });
}
