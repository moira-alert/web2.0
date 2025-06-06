import { test as base, expect } from "@playwright/test";
import { TriggerInfoPage } from "../pages/triggerInfo.page";
import { TriggerForm } from "../pages/triggerForm";
import { MainPage } from "../pages/main.page";
import {
    calculateMaintenanceTime,
    getMaintenanceCaption,
    Maintenance,
    MaintenanceList,
} from "../../src/Domain/Maintenance";
import { humanizeDuration } from "../../src/helpers/DateUtil";
import { maintenanceDelta } from "../../src/Domain/Trigger";

const triggerName = "test trigger name";
const testTriggerDescription = "test trigger description";

const test = base.extend<{
    triggerName: string;
    triggerNameDuplicate: string;
    triggerNameChanged: string;
    triggerDescription: string;
    triggerDescriptionChanged: string;
    expression: string;
}>({
    triggerName,
    triggerNameDuplicate: `${triggerName} (copy)`,
    triggerNameChanged: `${triggerName} changed`,
    triggerDescription: testTriggerDescription,
    triggerDescriptionChanged: `${testTriggerDescription} changed`,
    expression: "t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)",
});

test.describe.configure({ mode: "serial" });

test("Add trigger", async ({ triggerName, triggerDescription, page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await mainPage.addTriggerButton.click();
    await expect(page).toHaveURL("/trigger/new");

    const triggerForm = new TriggerForm(page);
    await triggerForm.triggerNameField.fill(triggerName);
    await triggerForm.descriptionField.fill(triggerDescription);
    await triggerForm.target(1).click();
    await triggerForm.target(1).pressSequentially("testmetric");
    await triggerForm.warnValue.fill("1");
    await triggerForm.errorValue.fill("2");
    await triggerForm.tagsField.click();
    await triggerForm.addTag("testTag");
    await page.getByText("testTag").click();
    const responsePromise = page.waitForResponse(/api\/trigger$/);
    await triggerForm.submitButton("Add").click();
    const response = await responsePromise;
    const responseJson = await response.json();

    await expect(page).toHaveURL(`/trigger/${responseJson.id}`);
    await expect(page.getByText(triggerName)).toBeVisible();
    await expect(page.getByText(triggerDescription)).toBeVisible();
});

test("Set trigger maintenance for all intervals", async ({ triggerName, page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(triggerName).click();

    const triggerInfoPage = new TriggerInfoPage(page);

    for (const maintenance of MaintenanceList) {
        await test.step(`Set maintenance to ${getMaintenanceCaption(maintenance)}`, async () => {
            const setMaintenanceRequestPromise = page.waitForRequest("**/trigger/*/setMaintenance");

            const expectedTriggerTime = calculateMaintenanceTime(maintenance);

            await triggerInfoPage.triggerMaintenance.click();

            await page.getByText(getMaintenanceCaption(maintenance)).click();

            const setMaintenanceRequest = await setMaintenanceRequestPromise;

            const requestBody = JSON.parse(setMaintenanceRequest.postData() || "{}");
            expect(requestBody).not.toBeNull();
            expect(Math.abs(requestBody.trigger - expectedTriggerTime)).toBeLessThanOrEqual(1);
            if (maintenance === Maintenance.off) {
                await expect(page.getByText("Maintenance")).toBeVisible();
            } else
                await expect(
                    page.getByText(humanizeDuration(maintenanceDelta(expectedTriggerTime)))
                ).toBeVisible();
        });
    }
});

test("Duplicate trigger", async ({
    triggerName,
    triggerNameDuplicate: duplicateTriggerName,
    triggerDescription,
    page,
}) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(triggerName).click();

    const triggerInfoPage = new TriggerInfoPage(page);
    await triggerInfoPage.menuListButton.click();

    const [duplicateTriggerPage] = await Promise.all([
        page.waitForEvent("popup"),
        triggerInfoPage.duplicateButton.click(),
    ]);

    const triggerForm = new TriggerForm(duplicateTriggerPage);
    await expect(triggerForm.triggerNameField).toHaveValue(duplicateTriggerName);
    await expect(triggerForm.descriptionField).toHaveText(triggerDescription);
    await expect(triggerForm.target(1)).toContainText("testmetric");
    await expect(triggerForm.simpleModeTab).toHaveAttribute("tabindex", "0");
    await expect(triggerForm.statusSelect).toHaveText("NODATA");

    const responsePromise = duplicateTriggerPage.waitForResponse(/api\/trigger$/);
    await triggerForm.submitButton("Duplicate").click();
    await responsePromise;

    await mainPage.gotoMainPage();
    await expect(duplicateTriggerPage.getByText(duplicateTriggerName)).toBeVisible();
});

test("Edit existing trigger", async ({
    triggerName,
    triggerNameChanged,
    triggerDescriptionChanged,
    expression,
    page,
}) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(triggerName, { exact: true }).click();

    const triggerInfoPage = new TriggerInfoPage(page);
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.editButton.click();
    await expect(page).toHaveURL(/trigger\/.*\/edit/);

    const triggerForm = new TriggerForm(page);
    await triggerForm.triggerNameField.fill(triggerNameChanged);
    await triggerForm.descriptionField.fill(triggerDescriptionChanged);
    await triggerForm.prometheusRemoteRadio.click();
    await triggerForm.clusterSelect.click();
    await page.getByText("Prometheus 1").click();
    await triggerForm.target(1).click();
    await triggerForm.target(1).click({ clickCount: 3 });
    await page.keyboard.press("Backspace");
    await triggerForm.target(1).pressSequentially("metric1");
    await triggerForm.addTargetButton.click();
    await expect(triggerForm.simpleModeTab).toHaveAttribute("tabindex", "-1");
    await triggerForm.target(2).click();
    await triggerForm.target(2).pressSequentially("metric2");
    await triggerForm.addTargetButton.click();
    await triggerForm.target(3).click();
    await triggerForm.target(3).pressSequentially("metric3");
    await triggerForm.deleteTarget(2).click();
    await triggerForm.expressionField.fill(expression);
    await triggerForm.statusSelect.click();
    await page.getByText("OK").click();

    const responsePromise = page.waitForResponse(/api\/trigger\/.*/);
    await triggerForm.submitButton("Save").click();
    const response = await responsePromise;
    const responseJson = await response.json();

    await expect(page).toHaveURL(`/trigger/${responseJson.id}`);
    await expect(page.getByText(triggerNameChanged)).toBeVisible();
    await expect(page.getByText(triggerDescriptionChanged)).toBeVisible();
    await expect(page.getByText("metric1")).toBeVisible();
    await expect(page.getByText("metric3")).toBeVisible();
});

test("Delete trigger", async ({ triggerNameChanged, triggerNameDuplicate, page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(triggerNameChanged).click();
    const triggerInfoPage = new TriggerInfoPage(page);
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.deleteButton.click();

    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(triggerNameChanged)).not.toBeVisible();

    await mainPage.gotoMainPage();
    await page.getByText(triggerNameDuplicate).click();
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.deleteButton.click();

    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(triggerNameDuplicate)).not.toBeVisible();
});
