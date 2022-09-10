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
            nameInput,
            descriptionInput,
            targetInput,
            simpleModeFallingRadio,
            warnRisingValueInput,
            errorRisingValueInput,
            warnFallingValueInput,
            errorFallingValueInput,
            tagsInput,
            createTriggerButton,
        } = form;

        await mainPage.goto();
        await mainPage.addTriggerButton.click();

        // Try to create trigger from empty form
        await createTriggerButton.click();
        await expect(form.getMessageNear(nameInput, "Can't be empty")).toBeVisible();
        await targetInput.hover();
        await expect(form.getMessageNear(targetInput, "Can't be empty")).toBeVisible();
        await warnRisingValueInput.hover();
        await expect(
            form.getMessageNear(warnRisingValueInput, "At least one of the values must be filled")
        ).toBeVisible();
        await tagsInput.hover();
        await expect(form.getMessageNear(tagsInput, "Select at least one tag")).toBeVisible();

        // Try to create trigger with wrong target
        await nameInput.fill("test name");
        await descriptionInput.fill("test description");
        await targetInput.fill("wrong target");
        await warnRisingValueInput.fill("2");
        await tagsInput.fill("test tag");
        await form.getTagBadgeByName("test tag").click();
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

        // Try to create trigger in Simple mode with wrong Error/Warn values
        await errorRisingValueInput.fill("1");
        await createTriggerButton.click();
        await errorRisingValueInput.hover();
        await expect(
            form.getMessageNear(
                errorRisingValueInput,
                "Error value must be greater than Warn value"
            )
        ).toBeVisible();
        await errorRisingValueInput.fill("3");

        await simpleModeFallingRadio.click();
        await warnFallingValueInput.fill("1");
        await errorFallingValueInput.fill("2");
        await createTriggerButton.click();
        await errorFallingValueInput.hover();
        await expect(
            form.getMessageNear(errorFallingValueInput, "Error value must be less than Warn value")
        ).toBeVisible();
        await warnFallingValueInput.fill("3");

        await createTriggerButton.click();
        await expect(page).toHaveURL(/http:\/\/localhost:9000\/trigger\/[a-z\d-]*/);
    });
});
