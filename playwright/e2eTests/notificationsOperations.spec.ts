import { test as base, expect } from "playwright/test";
import { NotificationsPage } from "../pages/notifications.page";

const test = base.extend<{
    channelType: string;
    channelTypeEdited: string;
    channelAccountName: string;
    channelAccountNameEdited: string;
    tag: string;
}>({
    channelType: "E-mail",
    channelTypeEdited: "Telegram",
    channelAccountName: "testmail@test.com",
    channelAccountNameEdited: "#testtelegramaccount",
    tag: "testTag",
});

test("Notifications operations", async ({
    channelType,
    channelTypeEdited,
    channelAccountName,
    channelAccountNameEdited,
    tag,
    page,
}) => {
    const notificationsPage = new NotificationsPage(page);

    await test.step("Add delivery channel", async () => {
        await notificationsPage.gotoNotificationsPage();
        await notificationsPage.addDeliveryChannelButton.click();
        await notificationsPage.modalSelectChannelTypeButton.click();
        await page.getByRole("button", { name: `${channelType}` }).click();
        await page.locator(`input:below(:text('${channelType}'))`).fill(channelAccountName);
        await notificationsPage.modalActionDeliveryChannelButton("Add").click();
        await expect(page.getByText(channelAccountName)).toBeVisible();
    });

    await test.step("Edit existing delivery channel", async () => {
        notificationsPage.deliveryChannelItem(channelAccountName).click();
        await notificationsPage.modalSelectChannelTypeButton.click();
        await page.getByRole("button", { name: `${channelTypeEdited}` }).click();
        await page.locator(`input:below(:text('${channelTypeEdited}'))`).clear();
        await page
            .locator(`input:below(:text('${channelTypeEdited}'))`)
            .fill(channelAccountNameEdited);
        await notificationsPage.modalActionDeliveryChannelButton("Save").click();
    });

    await test.step("Add subscription", async () => {
        await notificationsPage.addSubscriptionButton.click();
        await notificationsPage.modalSelectDeliveryChannelButton.click();
        await page.locator(`button:has-text("${channelAccountNameEdited}")`).click();
        await page.locator("[data-tid='Tag dropdown select']").click();
        await page.locator(`[data-tid='Tag ${tag}']`).click();
        await notificationsPage.modalActionDeliveryChannelButton("Add").click();
    });

    await test.step("Delete subscription", async () => {
        await page.getByText(channelAccountNameEdited).nth(1).click();
        await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    });

    await test.step("Delete delivery channel", async () => {
        await page.getByText(channelAccountNameEdited).first().click();
        await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    });
});
