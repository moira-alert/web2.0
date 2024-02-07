import { test as base, expect } from "playwright/test";
import { NotificationsPage } from "../pages/notifications.page";

const test = base.extend<{
    channelType: string;
    channelTypeEdited: string;
    channelAccountName: string;
    channelAccountNameEdited: string;
    tag: string;
    notificationsPage: NotificationsPage;
}>({
    channelType: "E-mail",
    channelTypeEdited: "Telegram",
    channelAccountName: "testmail@test.com",
    channelAccountNameEdited: "#testtelegramaccount",
    tag: "testTag",
    notificationsPage: async ({ page }, use) => {
        const notificationsPage = new NotificationsPage(page);
        await notificationsPage.gotoNotificationsPage();
        await use(notificationsPage);
    },
});

test.describe.configure({ mode: "serial" });

test("Add delivery channel", async ({
    channelType,
    channelAccountName,
    page,
    notificationsPage,
}) => {
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
    notificationsPage.deliveryChannelItem(channelAccountName).click();
    await notificationsPage.modalSelectChannelTypeButton.click();
    await page.getByRole("button", { name: `${channelTypeEdited}` }).click();
    await page.locator(`input:below(:text('${channelTypeEdited}'))`).clear();
    await page.locator(`input:below(:text('${channelTypeEdited}'))`).fill(channelAccountNameEdited);
    await notificationsPage.modalActionDeliveryChannelButton("Save").click();
});

test("Add subscription", async ({ channelAccountNameEdited, tag, page, notificationsPage }) => {
    await notificationsPage.addSubscriptionButton.click();
    await notificationsPage.modalSelectDeliveryChannelButton.click();
    await page.locator(`button:has-text("${channelAccountNameEdited}")`).click();
    await page.locator("[data-tid='Tag dropdown select']").click();
    await page.locator(`[data-tid='Tag ${tag}']`).click();
    await notificationsPage.modalActionDeliveryChannelButton("Add").click();
});

test("Delete subscription", async ({ channelAccountNameEdited, page, notificationsPage }) => {
    await page.getByText(channelAccountNameEdited).nth(1).click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
});

test("Delete delivery channel", async ({ channelAccountNameEdited, page, notificationsPage }) => {
    await page.getByText(channelAccountNameEdited).first().click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
});
