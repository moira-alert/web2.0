import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/MainPage";
import { TriggerFormPage } from "./pages/TriggerFormPage";
import { clearDatabase } from "./utils";

test.beforeAll(async () => {
    await clearDatabase();
});

test.describe("Trigger CRUD", () => {
    test("Create Trigger", async ({ page }) => {
        const mainPage = new MainPage(page);
        const triggerFormPage = new TriggerFormPage(page);

        await mainPage.goto();
        await mainPage.addTriggerButton.click();

        await triggerFormPage.createTriggerButton.click();
        await page.locator("text=Can't be empty");
        await page.locator("text=Select at least one tag");
        await page.locator("text=At least one of values must be filled");

        await triggerFormPage.nameInput.fill("test name");
        await triggerFormPage.descriptionInput.fill("test description");
        await triggerFormPage.targetInput.fill("wrong target");

        await triggerFormPage.tagsInput.click();
        await triggerFormPage.tagsInput.fill("test tag");
        await triggerFormPage.getTagBadgeByName("test tag").click();

        await triggerFormPage.warnValueInput.fill("2");

        await triggerFormPage.createTriggerButton.click();
        await page.locator(
            "text=wrong: Function is not supported, if you want to use it, switch to remote"
        );

        await triggerFormPage.targetInput.fill("sumSeries(test.target.*)");
        await triggerFormPage.createTriggerButton.click();
        await expect(page).toHaveURL(/http:\/\/localhost:9000\/trigger\/[a-z\d-]*/);

        await mainPage.goto();
        await page.locator("text=test name");
    });
});
