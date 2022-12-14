import { test, expect } from "@playwright/test";
import { MainPage } from "./pages/MainPage";
import { TriggerFormPage } from "./pages/TriggerFormPage";
import { clearDatabase } from "./utils";

test.afterAll(async () => clearDatabase());

test.describe("Trigger form", () => {
    test("Create Trigger", async ({ page }) => {
        const mainPage = new MainPage(page);
        const {
            nameInput,
            descriptionInput,
            targetInput,
            addTargetButton,
            simpleModeFallingRadio,
            targetValueInput,
            expressionInput,
            tagsInput,
            tagBadge,
            createTriggerButton,
        } = new TriggerFormPage(page);

        await mainPage.goto();
        await mainPage.addTriggerButton.click();

        await test.step("Try to create trigger from empty form", async () => {
            await createTriggerButton.click();

            await nameInput.hover();
            await expect(page.locator("text=Can't be empty")).toBeVisible();

            await targetInput(1).hover();
            await expect(page.locator("text=Can't be empty")).toBeVisible();

            await targetValueInput("warn", "rising").hover();
            await expect(
                page.locator("text=At least one of the values must be filled")
            ).toBeVisible();

            await tagsInput.hover();
            await expect(page.locator("text=Select at least one tag")).toBeVisible();
        });

        await test.step("Try to create trigger with wrong Target", async () => {
            await nameInput.fill("test name");
            await descriptionInput.fill("test description");
            await targetValueInput("warn", "rising").fill("2");
            await tagsInput.fill("test tag");
            await tagBadge("test tag").click();

            await targetInput(1).fill("wrong target");
            await Promise.all([
                createTriggerButton.click(),
                page.waitForResponse(/trigger\/check/),
            ]);
            await expect(
                page.locator(
                    "text=Syntax error"
                )
            ).toBeVisible();

            await targetInput(1).fill("compressPeriodicGaps()");
            await Promise.all([
                createTriggerButton.click(),
                page.waitForResponse(/trigger\/check/),
            ]);
            await expect(
                page.locator(
                    "text=Function is not supported, if you want to use it, switch to remote"
                )
            ).toBeVisible();

            await targetInput(1).fill("sumSeries(test.target.*");
            await createTriggerButton.click();
            await expect(page.locator("text=Syntax error")).toBeVisible();

            await targetInput(1).fill("sumSeries(test.target.*)");
        });

        await test.step(
            "Try to create trigger in Simple mode with wrong Error/Warn values",
            async () => {
                await targetValueInput("error", "rising").fill("1"); // Warn value would've been filled on the prev step
                await createTriggerButton.click();
                await targetValueInput("error", "rising").hover();
                await expect(
                    page.locator("text=Error value must be greater than Warn value")
                ).toBeVisible();
                await targetValueInput("error", "rising").fill("3");

                await simpleModeFallingRadio.click();

                await targetValueInput("warn", "falling").fill("1");
                await targetValueInput("error", "falling").fill("2");
                await createTriggerButton.click();
                await targetValueInput("error", "falling").hover();
                await expect(
                    page.locator("text=Error value must be less than Warn value")
                ).toBeVisible();
                await targetValueInput("warn", "falling").fill("3");
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
                await targetInput(2).fill("wrong target");
                await createTriggerButton.click();
                await expect(
                    page.locator(
                        "text=Syntax error"
                    )
                ).toBeVisible();

                await targetInput(2).fill("compressPeriodicGaps()");
                await Promise.all([
                    createTriggerButton.click(),
                    page.waitForResponse(/trigger\/check/),
                ]);
                await expect(
                    page.locator(
                        "text=Function is not supported, if you want to use it, switch to remote"
                    )
                ).toBeVisible();
                
                await targetInput(2).fill("sumSeries(test.target.*");
                await createTriggerButton.click();
                await expect(page.locator("text=Syntax error")).toBeVisible();
                await targetInput(2).fill("sumSeries(test.target.*)");

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
            /*
                Due to Moira's architecture quirks and using a non-relational DB, backend will return the response before the database finishes indexing/updating.
                Therefore, a new trigger will not be instantly visible on the main page, which is not noticeable to users, but messes with this part of the test.
                A hard wait was added on the next line as the simplest solution to this problem at the moment.
            */ 
            await page.waitForTimeout(1000);
            await mainPage.goto();
            await expect(page.locator("text=test name")).toBeVisible();
        });
    });
});
