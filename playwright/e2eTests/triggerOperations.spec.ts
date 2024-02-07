import { expect } from "@playwright/test";
import test from "./fixtures/addTriggerFixture";
import { TriggerInfoPage } from "../pages/triggerInfo.page";
import { TriggerForm } from "../pages/triggerForm";
import { MainPage } from "../pages/main.page";

test.describe.configure({ mode: "serial" });

test("Add trigger", async ({ testTriggerName, testTriggerDescription, page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await mainPage.addTriggerButton.click();
    await expect(page).toHaveURL("/trigger/new");

    const triggerForm = new TriggerForm(page);
    await triggerForm.triggerNameField.fill(testTriggerName);
    await triggerForm.descriptionField.fill(testTriggerDescription);
    await triggerForm.target(1).click();
    await triggerForm.target(1).pressSequentially("testmetric");
    await triggerForm.warnValue.fill("1");
    await triggerForm.errorValue.fill("2");
    await triggerForm.tagsField.fill("testTag");
    await page.getByText("testTag").click();
    const responsePromise = page.waitForResponse(/api\/trigger$/);
    await triggerForm.submitButton("Add").click();
    const response = await responsePromise;
    const responseJson = await response.json();

    await expect(page).toHaveURL(`/trigger/${responseJson.id}`);
    await expect(page.getByText(testTriggerName)).toBeVisible();
    await expect(page.getByText(testTriggerDescription)).toBeVisible();
});

test("Duplicate trigger", async ({ testTriggerName, testTriggerDescription, page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(testTriggerName).click();

    const triggerInfoPage = new TriggerInfoPage(page);
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

    const responsePromise = duplicateTriggerPage.waitForResponse(/api\/trigger$/);
    await triggerForm.submitButton("Duplicate").click();
    await responsePromise;

    await mainPage.gotoMainPage();
    await expect(duplicateTriggerPage.getByText(testTriggerName + " (copy)")).toBeVisible();
});

test("Edit existing trigger", async ({
    testTriggerName,
    testTriggerDescription,
    testExpression,
    page,
}) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(testTriggerName, { exact: true }).click();

    const triggerInfoPage = new TriggerInfoPage(page);
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.editButton.click();
    await expect(page).toHaveURL(/trigger\/.*\/edit/);

    const triggerForm = new TriggerForm(page);
    await triggerForm.triggerNameField.fill(`${testTriggerName} changed`);
    await triggerForm.descriptionField.fill(`${testTriggerDescription} changed`);
    await triggerForm.prometheusRemoteRadio.click();
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
    await triggerForm.expressionField.fill(testExpression);
    await triggerForm.statusSelect.click();
    await page.getByText("OK").click();

    const responsePromise = page.waitForResponse(/api\/trigger\/.*/);
    await triggerForm.submitButton("Save").click();
    const response = await responsePromise;
    const responseJson = await response.json();

    await expect(page).toHaveURL(`/trigger/${responseJson.id}`);
    await expect(page.getByText(`${testTriggerName} changed`)).toBeVisible();
    await expect(page.getByText(`${testTriggerDescription} changed`)).toBeVisible();
    await expect(page.getByText("metric1")).toBeVisible();
    await expect(page.getByText("metric3")).toBeVisible();
});

test("Delete trigger", async ({ testTriggerName, page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText(`${testTriggerName} changed`).click();
    const triggerInfoPage = new TriggerInfoPage(page);
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.deleteButton.click();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(`${testTriggerName} changed`)).not.toBeVisible();

    await mainPage.gotoMainPage();
    await page.getByText(`${testTriggerName} (copy)`).click();
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.deleteButton.click();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(`${testTriggerName} (copy)`)).not.toBeVisible();
});
