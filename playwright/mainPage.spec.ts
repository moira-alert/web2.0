import { test, expect } from "@playwright/test";

test.describe("Main page", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        testInfo.snapshotSuffix = "";
        await page.goto("/");
    });

    test("Navigation", async ({ page }) => {
        await expect(page).toHaveScreenshot();
        await page.locator("text=Add Trigger").click();
        await expect(page).toHaveURL("/trigger/new");

        await page.goto("/");

        await page.locator("text=Элитарный сангвиник в XXI веке").click();
        await expect(page).toHaveURL("/trigger/f96c5608-bd00-4ea2-abd5-be677cdf7e03");

        await page.locator("text=Teams").click();
        await expect(page).toHaveURL("/teams");

        await page.goto("/");

        await page.locator("text=Notifications").click();
        await expect(page).toHaveURL("/settings/");

        await page.goto("/");

        await page.locator("text=Help").click();
        await expect(page).toHaveURL("https://moira.readthedocs.io/en/latest/");
    });

    test("Search field", async ({ page }) => {
        await page.locator('input[type="text"]').click();
        await page.locator('input[type="text"]').fill("test");
        await page.locator("text=moira-test").click();
        await expect(page).toHaveURL("/?onlyProblems=false&page=1&searchText=&tags[0]=moira-test");
        await page.locator('input[type="text"]').click();
        await page.locator('input[type="text"]').fill("test");
        await page.locator('input[type="text"]').press("Enter");
        await expect(page).toHaveURL(
            "/?onlyProblems=false&page=1&searchText=test&tags[0]=moira-test"
        );
        await expect(page).toHaveScreenshot();
    });

    test("View metrics", async ({ page }) => {
        await page.locator("[data-tid=TriggerListItem_status]").nth(2).click();
        await page.locator('text="Maintenance"').first().click();
        await expect(page).toHaveScreenshot();
    });
});
