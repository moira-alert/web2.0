import { expect, test as base } from "@playwright/test";
import { NotificationsPage } from "../pages/notifications.page";

const test = base.extend<{
    channelType: string;
    channelTypeEdited: string;
    channelAccountName: string;
    channelAccountNameEdited: string;
    tag: string;
    triggerName: string;
    notificationsPage: NotificationsPage;
}>({
    channelType: "E-mail",
    channelTypeEdited: "Telegram",
    channelAccountName: "testmail@test.com",
    channelAccountNameEdited: "#testtelegramaccount",
    triggerName: "notifications test trigger",
    tag: "testTag",
    notificationsPage: async ({ page }, use) => {
        const notificationsPage = new NotificationsPage(page);
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
    await expect(page.getByText(channelAccountNameEdited)).toBeVisible();
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

test("Can`t delete channel with active subscription", async ({
    channelAccountNameEdited,
    page,
    notificationsPage,
}) => {
    await notificationsPage.gotoNotificationsPage();
    await page.getByText(channelAccountNameEdited).first().click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    await expect(
        page.getByText(
            "Can't delete this delivery channel. This will disrupt the functioning of the following subscriptions:"
        )
    ).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
});

test("Delete subscription", async ({ channelAccountNameEdited, page, notificationsPage }) => {
    await notificationsPage.gotoNotificationsPage();
    await page.getByText(channelAccountNameEdited).nth(1).click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    await expect(page.getByText(channelAccountNameEdited).nth(1)).not.toBeVisible();
});

test("Delete delivery channel", async ({ channelAccountNameEdited, page, notificationsPage }) => {
    await notificationsPage.gotoNotificationsPage();
    await page.getByText(channelAccountNameEdited).first().click();
    await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    await expect(page.getByText(channelAccountNameEdited)).not.toBeVisible();
});
