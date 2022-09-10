import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/MainPage";
import { TriggerFormPage } from "./pages/TriggerFormPage";
import { clearDatabase } from "./utils";

test.afterAll(async () => clearDatabase());

test.describe("Trigger CRUD", () => {
    test("Create Trigger", async ({ page }) => {
        const mainPage = new MainPage(page);
        const form = new TriggerFormPage(page);
        const {
            createTriggerButton,
            nameInput,
            targetInput,
            warnValueInput,
            tagsInput,
            descriptionInput,
        } = form;

        await mainPage.goto();
        await mainPage.addTriggerButton.click();

        await createTriggerButton.click();
        await expect(form.getMessageNear(nameInput, "Can't be empty")).toBeVisible();
        await targetInput.click();
        await expect(form.getMessageNear(targetInput, "Can't be empty")).toBeVisible();
        await warnValueInput.click();
        await expect(
            form.getMessageNear(warnValueInput, "At least one of values must be filled")
        ).toBeVisible();
        await tagsInput.click();
        await expect(form.getMessageNear(tagsInput, "Select at least one tag")).toBeVisible();

        await nameInput.fill("test name");
        await descriptionInput.fill("test description");
        await targetInput.fill("wrong target");

        await tagsInput.fill("test tag");
        await form.getTagBadgeByName("test tag").click();

        await warnValueInput.fill("2");

        await createTriggerButton.click();
        await expect(
            form.getMessageNear(
                targetInput,
                "Function is not supported, if you want to use it, switch to remote"
            )
        ).toBeVisible();

        await targetInput.fill("sumSeries(test.target.*");
        await createTriggerButton.click();
        await expect(form.getMessageNear(targetInput, "Syntax error")).toBeVisible();
        await targetInput.type(")");
        await createTriggerButton.click();
        await expect(page).toHaveURL(/http:\/\/localhost:9000\/trigger\/[a-z\d-]*/);
    });
});
