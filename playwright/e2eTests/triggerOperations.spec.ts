import { Page, expect } from "@playwright/test";
import test from "./fixtures/addTriggerFixture";
import { TriggerInfoPage } from "../pages/triggerInfo.page";
import { TriggerForm } from "../pages/triggerForm";

const clearTargetField = async (page: Page, numOfTimes: number) => {
    for (let i = 0; i <= numOfTimes; i++) {
        await page.keyboard.press("Backspace");
    }
};

test("Duplicate trigger", async ({ testTriggerName, testTriggerDescription, addTrigger }) => {
    const { page, testTriggerID } = addTrigger;
    const triggerInfoPage = new TriggerInfoPage(page, testTriggerID);
    await triggerInfoPage.gotoTriggerInfoPage();
    await triggerInfoPage.menuListButton.click();

    const [duplicateTriggerPage] = await Promise.all([
        page.waitForEvent("popup"),
        triggerInfoPage.duplicateButton.click(),
    ]);

    const triggerForm = new TriggerForm(duplicateTriggerPage);
    await expect(triggerForm.triggerNameField).toHaveValue(testTriggerName + " (copy)");
    await expect(triggerForm.descriptionField).toHaveText(testTriggerDescription);
    await expect(triggerForm.target(1)).toContainText("testmetric");
    await expect(triggerForm.simpleModeTab).toHaveAttribute("tabindex", "0");
    await expect(triggerForm.statusSelect).toHaveText("NODATA");

    Promise.all([
        await triggerForm.submitButton("Duplicate").click(),
        await duplicateTriggerPage.waitForResponse(/api\/trigger/),
    ]);
});

test("Edit existing trigger", async ({
    testTriggerName,
    testTriggerDescription,
    triggerForm,
    testExpression,
    addTrigger,
    page,
}) => {
    const { testTriggerID } = addTrigger;
    const triggerInfoPage = new TriggerInfoPage(page, testTriggerID);

    await triggerInfoPage.gotoTriggerInfoPage();
    await triggerInfoPage.editButton.click();
    await expect(page).toHaveURL(`/trigger/${testTriggerID}/edit`);
    await triggerForm.triggerNameField.fill(`${testTriggerName} changed`);
    await triggerForm.descriptionField.fill(`${testTriggerDescription} changed`);
    await triggerForm.prometheusRemoteRadio.click();
    await triggerForm.target(1).click();
    await clearTargetField(page, "testmetric".length);
    await triggerForm.target(1).pressSequentially("metric1");
    await triggerForm.addTargetButton.click();
    await expect(triggerForm.simpleModeTab).toHaveAttribute("tabindex", "-1");
    await triggerForm.target(2).click();
    await triggerForm.target(2).pressSequentially("metric2");
    await triggerForm.addTargetButton.click();
    await triggerForm.target(3).click();
    await triggerForm.target(3).pressSequentially("metric3");
    await triggerForm.deleteTarget(2).click();
    await triggerForm.expressionField.fill(testExpression);
    await triggerForm.statusSelect.click();
    const status = page.getByText("OK");
    await status.click();
    await expect(triggerForm.target(1)).toContainText("metric1");
    await expect(triggerForm.target(2)).toContainText("metric3");
    await expect(triggerForm.prometheusRemoteRadio).toBeChecked();
    await expect(triggerForm.triggerNameField).toHaveValue(`${testTriggerName} changed`);
    await expect(triggerForm.descriptionField).toHaveValue(`${testTriggerDescription} changed`);

    Promise.all([
        await triggerForm.submitButton("Save").click(),
        await page.waitForResponse(/api\/trigger/),
    ]);
});
