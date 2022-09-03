import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/MainPage";

test.describe("Main page", () => {
    test("Navigation", async ({ page }) => {
        const mainPage = new MainPage(page);

        await mainPage.goto();
        await mainPage.addTriggerButton.click();
        await expect(page).toHaveURL("/trigger/new");

        await mainPage.goto();
        await mainPage.teamsLink.click();
        await expect(page).toHaveURL("/teams");

        await mainPage.goto();
        await mainPage.notificationsLink.click();
        await expect(page).toHaveURL("/settings/");

        await mainPage.goto();
        await mainPage.helpLink.click();
        await page.route("https://moira.readthedocs.io/en/latest/", (route) => route.abort());
    });
});
