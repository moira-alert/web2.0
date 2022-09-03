import { test, expect } from "@playwright/test";

test.describe("Main page", () => {
    test("Navigation", async ({ page }) => {
        await page.goto("/");
        await page.locator("text=Add Trigger").click();
        await expect(page).toHaveURL("/trigger/new");

        await page.goto("/");
        await page.locator("text=Teams").click();
        await expect(page).toHaveURL("/teams");

        await page.goto("/");
        await page.locator("text=Notifications").click();
        await expect(page).toHaveURL("/settings/");

        await page.goto("/");
        await page.locator("text=Help").click();
        await page.route("https://moira.readthedocs.io/en/latest/", (route) => route.abort());
    });
});

test.describe("Trigger CRUD", () => {
    test("Create Trigger", async ({ page }) => {
        await page.goto("/trigger/new");

        await page.locator('[data-tid="Name"]').fill("test name");

        await page.locator('[data-tid="Description"]').fill("test description");

        await page.locator('[data-tid="Target T1"]').fill("wrong target");

        await page.locator('[data-tid="Add Trigger"]').click();
        await page.locator("text=Select at least one tag");

        await page.locator('[data-tid="Tags"]').fill("test tag");
        await page.locator('[data-tid="Tag"]', { hasText: "test tag" }).click();

        await page.locator('[data-tid="Add Trigger"]').click();
        await page.locator("text=At least one of values must be filled");

        await page.locator('[data-tid="WARN T1"]').first().fill("2");

        await page.locator('[data-tid="Add Trigger"]').click();
        await page.locator(
            "text=wrong: Function is not supported, if you want to use it, switch to remote"
        );

        await page.locator('[data-tid="Target T1"]').fill("sumSeries(test.target.*)");
        await page.locator('[data-tid="Add Trigger"]').click();
        await expect(page).toHaveURL(/http:\/\/localhost:9000\/trigger\/[a-z\d-]*/);
    });
});
