import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/MainPage";
import { TriggerFormPage } from "./pages/TriggerFormPage";
import { clearDatabase } from "./utils";

test.afterAll(async () => clearDatabase());

test.describe("Trigger CRUD", () => {
    test("Create Trigger", async ({ page }) => {
        const mainPage = new MainPage(page);
        const {
            nameInput,
            descriptionInput,
            targetInput,
            addTargetButton,
            simpleModeFallingRadio,
            warnRisingValueInput,
            errorRisingValueInput,
            warnFallingValueInput,
            errorFallingValueInput,
            expressionInput,
            tagsInput,
            tagBadge,
            createTriggerButton,
        } = new TriggerFormPage(page);

        await mainPage.goto();
        await mainPage.addTriggerButton.click();

        await test.step("Try to create trigger from empty form", async () => {
            await createTriggerButton.click();

            await targetInput.hover();
            await expect(page.locator("text=Can't be empty")).toHaveCount(2);

            await warnRisingValueInput.hover();
            await expect(
                page.locator("text=At least one of the values must be filled")
            ).toBeVisible();

            await tagsInput.hover();
            await expect(page.locator("text=Select at least one tag")).toBeVisible();
        });

        await test.step("Try to create trigger with wrong Target", async () => {
            await nameInput.fill("test name");
            await descriptionInput.fill("test description");
            await warnRisingValueInput.fill("2");
            await tagsInput.fill("test tag");
            await tagBadge("test tag").click();

            await targetInput.fill("wrong target");
            await createTriggerButton.click();
            await expect(
                page.locator(
                    "text=Function is not supported, if you want to use it, switch to remote"
                )
            ).toBeVisible();

            await targetInput.fill("sumSeries(test.target.*");
            await createTriggerButton.click();
            await expect(page.locator("text=Syntax error")).toBeVisible();

            await targetInput.type(")");
        });

        await test.step(
            "Try to create trigger in Simple mode with wrong Error/Warn values",
            async () => {
                await errorRisingValueInput.fill("1"); // Warn value would've been filled on the prev step
                await createTriggerButton.click();
                await errorRisingValueInput.hover();
                await expect(
                    page.locator("text=Error value must be greater than Warn value")
                ).toBeVisible();
                await errorRisingValueInput.fill("3");

                await simpleModeFallingRadio.click();

                await warnFallingValueInput.fill("1");
                await errorFallingValueInput.fill("2");
                await createTriggerButton.click();
                await errorFallingValueInput.hover();
                await expect(
                    page.locator("text=Error value must be less than Warn value")
                ).toBeVisible();
                await warnFallingValueInput.fill("3");
            }
        );

        await test.step(
            "Try to create trigger in Advanced mode with wrong second Target, Expression",
            async () => {
                await addTargetButton.click();

                await createTriggerButton.click();
                await expect(page.locator("text=Can't be empty")).toBeVisible();
                await expressionInput.hover();
                await expect(page.locator("text=Expression can't be empty")).toBeVisible();

                await expressionInput.fill("wrong expression");
                await targetInput.nth(1).fill("wrong target");
                await createTriggerButton.click();
                await expect(
                    page.locator(
                        "text=Function is not supported, if you want to use it, switch to remote"
                    )
                ).toBeVisible();
                await targetInput.nth(1).fill("sumSeries(test.target.*");
                await createTriggerButton.click();
                await expect(page.locator("text=Syntax error")).toBeVisible();
                await targetInput.nth(1).type(")");

                await createTriggerButton.click();
                await expect(page.locator("text=Cannot transition token types")).toBeVisible();
                await expressionInput.fill("t1 > t2");
                await createTriggerButton.click();
                await expect(
                    page.locator("text=expression result must be state value")
                ).toBeVisible();
                await expressionInput.fill("t1 > t2 ? ERROR : OK");
            }
        );

        await test.step("Create trigger & check for success", async () => {
            await createTriggerButton.click();
            await expect(page).toHaveURL(/[a-z\d]+-+/);

            await page.waitForTimeout(1000); // TODO: wait for request to finish instead of timeout
            await mainPage.goto();
            await expect(page.locator("text=test name")).toBeVisible;
        });
    });
});
