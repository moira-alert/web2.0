import { test, expect, Page } from "@playwright/test";
import { MainPage } from "../pages/main.page";
import { TriggerForm } from "../pages/triggerForm";
import { TriggerInfoPage } from "../pages/triggerInfo.page";

let TRIGGER_NAME = "test trigger name";
let TRIGGER_DESCRIPTION = "test trigger description";
let TRIGGER_TARGET = "aliasByMetric(testmetric)";
let EXPRESSION = "t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)";
let TEST_TAG = "testTag";

const clearTargetField = async (page: Page, numOfTimes: number) => {
    for (let i = 0; i <= numOfTimes; i++) {
        await page.keyboard.press("Backspace");
    }
};

test.describe("Add trigger form", () => {
    test("Add trigger", async ({ page }) => {
        const mainPage = new MainPage(page);
        const triggerForm = new TriggerForm(page);
        await test.step("Add valid trigger", async () => {
            await mainPage.gotoMainPage();
            await mainPage.addTriggerButton.click();
            await expect(page).toHaveURL("/trigger/new");
            await triggerForm.triggerNameField.fill(TRIGGER_NAME);
            await triggerForm.descriptionField.fill(TRIGGER_DESCRIPTION);
            await triggerForm.target(1).click();
            await triggerForm.target(1).pressSequentially(TRIGGER_TARGET);
            await triggerForm.warnValue.fill("1");
            await triggerForm.errorValue.fill("2");
            await triggerForm.tagsField.fill(TEST_TAG);
            await triggerForm.newTagButton.click();
            await triggerForm.submitButton("Add").click();

            await page.waitForTimeout(1000);
            await mainPage.gotoMainPage();
            const addedTrigger = page.locator(`text=${TRIGGER_NAME}`);
            await expect(addedTrigger).toBeVisible();
        });

        await test.step("Edit existing trigger", async () => {
            const addedTrigger = page.locator(`text=${TRIGGER_NAME}`);
            await addedTrigger.click();
            const url = page.url().split("/");
            const triggerId = url[url.length - 1];

            const triggerForm = new TriggerForm(page);
            const triggerInfoPage = new TriggerInfoPage(page, triggerId);

            await triggerInfoPage.editButton.click();

            await expect(page).toHaveURL(`/trigger/${triggerId}/edit`);

            TRIGGER_NAME += " changed";
            await triggerForm.triggerNameField.fill(TRIGGER_NAME);

            TRIGGER_DESCRIPTION += " changed";
            await triggerForm.descriptionField.fill(TRIGGER_DESCRIPTION);

            await triggerForm.prometheusRemoteRadio.click();
            await expect(triggerForm.prometheusRemoteRadio).toBeChecked();

            await triggerForm.target(1).click();
            await clearTargetField(page, TRIGGER_TARGET.length);
            await triggerForm.target(1).pressSequentially("metric1");

            await triggerForm.addTargetButton.click();
            await expect(triggerForm.simpleModeTab).toHaveCSS("color", "rgba(34, 34, 34, 0.5)");
            await triggerForm.target(2).click();
            await triggerForm.target(2).pressSequentially("metric2");

            await triggerForm.addTargetButton.click();
            await triggerForm.target(3).click();
            await triggerForm.target(3).pressSequentially("metric3");

            await triggerForm.deleteTarget(2).click();

            await triggerForm.expressionField.fill(EXPRESSION);
            await triggerForm.statusSelect.click();
            const status = page.getByText("OK");
            await status.click();

            await triggerForm.submitButton("Save").click();

            await page.waitForTimeout(1000);
            await mainPage.gotoMainPage();

            const changedTrigger = page.locator(`text=${TRIGGER_NAME}`);
            await changedTrigger.click();

            await expect(triggerInfoPage.target(1)).toContainText("metric1");
            await expect(triggerInfoPage.target(2)).toContainText("metric3");
        });

        await test.step("Duplicate trigger", async () => {
            const url = page.url().split("/");
            const triggerId = url[url.length - 1];
            const triggerForm = new TriggerForm(page);
            const triggerInfoPage = new TriggerInfoPage(page, triggerId);
            await triggerInfoPage.menuListButton.click();
            await triggerInfoPage.duplicateButton.click(),
                await page.goto(`/trigger/${triggerId}/duplicate`);

            await expect(triggerForm.triggerNameField).toHaveAttribute(
                "value",
                TRIGGER_NAME + " (copy)"
            );
            await expect(triggerForm.descriptionField).toHaveText(TRIGGER_DESCRIPTION);
            await expect(triggerForm.target(1)).toContainText("metric1");
            await expect(triggerForm.target(2)).toContainText("metric3");
            await expect(triggerForm.advancedModeTab).toBeEnabled();
            await expect(triggerForm.simpleModeTab).toHaveCSS("color", "rgba(34, 34, 34, 0.5)");
            await expect(triggerForm.expressionField).toHaveAttribute("value", EXPRESSION);
            await expect(triggerForm.statusSelect).toHaveText("OK");
            await triggerForm.submitButton("Duplicate").click();
        });
    });
});
