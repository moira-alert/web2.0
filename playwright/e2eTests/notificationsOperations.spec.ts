import { expect, test as base, Page } from "@playwright/test";
import { NotificationsPage } from "../pages/notifications.page";
import { MainPage } from "../pages/main.page";
import { TriggerForm } from "../pages/triggerForm";
import { TriggerInfoPage } from "../pages/triggerInfo.page";

const test = base.extend<{
    channelType: string;
    channelTypeEdited: string;
    channelAccountName: string;
    channelAccountNameEdited: string;
    tag: string;
    notificationsPage: NotificationsPage;
    addTrigger: Page;
}>({
    channelType: "E-mail",
    channelTypeEdited: "Telegram",
    channelAccountName: "testmail@test.com",
    channelAccountNameEdited: "#testtelegramaccount",
    tag: "testTag",
    notificationsPage: async ({ page }, use) => {
        const notificationsPage = new NotificationsPage(page);
        await use(notificationsPage);
    },
});

test.describe.configure({ mode: "serial" });

test("Add trigger", async ({ page }) => {
    const mainPage = new MainPage(page);
    const triggerForm = new TriggerForm(page);
    await mainPage.gotoMainPage();
    await mainPage.addTriggerButton.click();
    await expect(page).toHaveURL("/trigger/new");
    await triggerForm.triggerNameField.fill("notifications test trigger name");
    await triggerForm.descriptionField.fill("notifications test trigger description");
    await triggerForm.target(1).click();
    await triggerForm.target(1).pressSequentially("testmetric");
    await triggerForm.warnValue.fill("1");
    await triggerForm.errorValue.fill("2");
    await triggerForm.addTag();
    await triggerForm.submitButton("Add").click();
});

test("Add delivery channel", async ({
    channelType,
    channelAccountName,
    page,
    notificationsPage,
}) => {
    await notificationsPage.gotoNotificationsPage();
    await notificationsPage.addDeliveryChannelButton.click();
    await notificationsPage.modalSelectChannelTypeButton.click();
    await page.getByRole("button", { name: `${channelType}` }).click();
    await page.locator(`input:below(:text('${channelType}'))`).fill(channelAccountName);
    await notificationsPage.modalActionDeliveryChannelButton("Add").click();
    await expect(page.getByText(channelAccountName)).toBeVisible();
});

test("Edit existing delivery channel", async ({
    channelTypeEdited,
    channelAccountName,
    channelAccountNameEdited,
    page,
    notificationsPage,
}) => {
    await notificationsPage.gotoNotificationsPage();
    notificationsPage.deliveryChannelItem(channelAccountName).click();
    await notificationsPage.modalSelectChannelTypeButton.click();
    await page.getByRole("button", { name: `${channelTypeEdited}` }).click();
    await page.locator(`input:below(:text('${channelTypeEdited}'))`).clear();
    await page.locator(`input:below(:text('${channelTypeEdited}'))`).fill(channelAccountNameEdited);
    await notificationsPage.modalActionDeliveryChannelButton("Save").click();
});

test("Add subscription", async ({ channelAccountNameEdited, tag, page, notificationsPage }) => {
    await notificationsPage.gotoNotificationsPage();
    await notificationsPage.addSubscriptionButton.click();
    await notificationsPage.modalSelectDeliveryChannelButton.click();
    await page.locator(`button:has-text("${channelAccountNameEdited}")`).click();
    await page.locator("[data-tid='Tag dropdown select']").click();
    await page.locator(`[data-tid='Tag ${tag}']`).click();
    await notificationsPage.modalActionDeliveryChannelButton("Add").click();
});

test("Delete subscription", async ({ channelAccountNameEdited, page, notificationsPage }) => {
    await notificationsPage.gotoNotificationsPage();
    await page.getByText(channelAccountNameEdited).nth(1).click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
});

test("Delete delivery channel", async ({ channelAccountNameEdited, page, notificationsPage }) => {
    await notificationsPage.gotoNotificationsPage();
    await page.getByText(channelAccountNameEdited).first().click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
});

test("Delete trigger", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.gotoMainPage();
    await page.getByText("notifications test trigger name").click();
    const triggerInfoPage = new TriggerInfoPage(page);
    await triggerInfoPage.menuListButton.click();
    await triggerInfoPage.deleteButton.click();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("notifications test trigger name")).not.toBeVisible();
});
