import { test, expect } from "@playwright/test";
const sizes = [
  [320, 568],
  [360, 640],
  [390, 844],
  [412, 915],
  [768, 1024],
  [1366, 768],
  [1920, 1080],
];
for (const [width, height] of sizes)
  test(`layout ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page).toHaveURL(/#\/exploration$/);
    await expect(
      page.getByRole("button", { name: /Ouvrir le menu/ }),
    ).toBeVisible();
    await expect(page.locator(".update-banner")).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute(
      "data-synaptik-page",
      "home",
    );
    await expect(
      page.getByRole("link", { name: /SYNAPTIK TEST QI/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /COMMENCER L’ANALYSE/ }),
    ).toBeVisible();
    await expect(page.getByText(/Créé par CR3@TIX/i)).toBeVisible();
    const supportButton = page.locator("#cr3atix-support-button-host").locator("a");
    await expect(supportButton).toHaveAttribute(
      "href",
      "https://kevinlabens-del.github.io/CR3-TIX-SOUTIEN-/",
    );
    await expect(supportButton).toContainText("Soutenir");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: /COMMENCER L’ANALYSE/ }).click();
    await expect(page).toHaveURL(/#\/preparation$/);
    await expect(page.locator("html")).toHaveAttribute(
      "data-synaptik-page",
      "setup",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("burger navigation exposes distinct application pages", async ({ page }) => {
  await page.goto("/#/exploration");
  await page.getByRole("button", { name: /Ouvrir le menu/ }).click();
  await expect(page.getByRole("navigation", { name: /Menu principal/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mes résultats" })).toHaveAttribute(
    "href",
    "#/resultats",
  );
  await page.getByRole("link", { name: "Mes résultats" }).click();
  await expect(page).toHaveURL(/#\/resultats$/);
  await expect(page.getByRole("heading", { name: "Mes résultats" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/exploration$/);
  await expect(
    page.getByRole("button", { name: /COMMENCER L’ANALYSE/ }),
  ).toBeVisible();
});
test("complete Quick assessment, restore history, practice and offline reload", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: /COMMENCER L’ANALYSE/ }).click();
  await page.getByRole("button", { name: /Rapide/i }).click();
  await page.getByRole("button", { name: /Voir les 3 exercices/ }).click();
  for (let n = 0; n < 3; n++) {
    await expect(
      page.getByText(`DÉMO ${n + 1}/3`, { exact: false }),
    ).toBeVisible();
    await page.locator(".option").first().waitFor();
    await page.locator(".option").first().click();
    await page.getByRole("button", { name: /Valider ma réponse/ }).click();
    await page.getByRole("button", { name: /Exercice suivant/ }).click();
  }
  await expect(page.getByRole("heading", { name: /Prépare ton exploration/i })).toBeVisible();
  await page.getByRole("button", { name: /Démarrer l’analyse/i }).click();
  for (let n = 0; n < 36; n++) {
    await expect(page.locator(".test-top")).toContainText(`${n + 1} / 36`);
    if (n % 6 === 5) {
      await expect(page.locator(".option")).toHaveCount(0);
      if (n === 5) await page.waitForTimeout(8500);
      await expect(page.getByText(/8 secondes/)).toBeVisible();
      await page
        .getByRole("button", { name: /^Je suis prêt$/i })
        .click();
      await expect(page.locator(".option").first()).toBeEnabled();
    }
    await page.locator(".option").first().waitFor();
    const first = page.locator(".option").first();
    if (await first.isEnabled()) {
      await first.click();
      await expect(first).toHaveAttribute("aria-pressed", "true");
    }
    if (n === 5) await page.waitForTimeout(1500);
    await page.getByRole("button", { name: /Valider ma réponse/ }).click();
    if (n === 2) {
      await expect(page.locator(".test-top")).toContainText("4 / 36");
      await page.getByRole("button", { name: /Pause et quitter/ }).click();
      await page.reload();
      await page
        .getByRole("button", { name: /Reprendre mon évaluation/ })
        .click();
    }
  }
  await expect(page.getByText("Votre empreinte cognitive")).toBeVisible();
  await expect(page.locator(".profile-list article")).toHaveCount(6);
  await expect(page.locator(".answer-review-item")).toHaveCount(36);
  await page.locator(".answer-review-item").first().locator("summary").click();
  await expect(
    page.locator(".answer-review-item").first(),
  ).toContainText("BONNE RÉPONSE");
  const stored = await page.evaluate(
    () =>
      new Promise<{
        testVersion: string;
        answers: {
          excluded?: boolean;
          duration: number;
          selectionTime?: number;
        }[];
      }>((resolve, reject) => {
        const request = indexedDB.open("synaptik", 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const read = db
            .transaction("sessions")
            .objectStore("sessions")
            .getAll();
          read.onsuccess = () => {
            resolve(read.result[0]);
            db.close();
          };
          read.onerror = () => reject(read.error);
        };
      }),
  );
  expect(stored.testVersion).toBe("1.3");
  expect(stored.answers[3].excluded).toBe(true);
  expect(stored.answers[5].duration).toBe(stored.answers[5].selectionTime);
  expect(stored.answers[5].duration).toBeLessThan(8000);
  const score = await page.locator(".big-score").textContent();
  await page.locator("header select").selectOption("en");
  await expect(page.locator(".big-score")).toHaveText(score!);
  await page.locator("header select").selectOption("fr");
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/result-${width}.png`,
      fullPage: true,
    });
  }

  await page.screenshot({ path: "test-results/results.png", fullPage: true });
  await page.getByRole("button", { name: /Ouvrir le menu/ }).click();
  await page.getByRole("link", { name: /Mes résultats/ }).click();
  await expect(page).toHaveURL(/#\/resultats$/);
  await expect(page.locator(".history-row")).toHaveCount(1);
  await page.getByRole("button", { name: /Ouvrir le menu/ }).click();
  await page.getByRole("link", { name: /Entraînement/ }).click();
  await expect(page).toHaveURL(/#\/entrainement$/);
  await page.locator(".option").first().click();
  await page.getByRole("button", { name: /Valider ma réponse/ }).click();
  await expect(page.locator(".feedback")).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveURL(/#\/entrainement$/);
  await expect(page.getByRole("heading", { name: "Entraînement" })).toBeVisible();
  await page.getByRole("button", { name: /Ouvrir le menu/ }).click();
  await page.getByRole("link", { name: /Mes résultats/ }).click();
  await expect(page).toHaveURL(/#\/resultats$/);
  await expect(page.locator(".history-row")).toHaveCount(1);
  expect(errors).toEqual([]);
});
