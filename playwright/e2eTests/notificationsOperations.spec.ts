import test from "./fixtures/addTriggerFixture";
import { expect } from "@playwright/test";
import { NotificationsPage } from "../pages/notifications.page";

test("Notifications operations", async ({
    testChannelType,
    testChannelAccountName,
    testTag,
    page,
}) => {
    const notificationsPage = new NotificationsPage(page);
    const testChannelAccountNameEdited = "#testtelegramaccount";

    await test.step("Add delivery channel", async () => {
        await notificationsPage.gotoNotificationsPage();
        await notificationsPage.addDeliveryChannelButton.click();
        await notificationsPage.modalSelectChannelTypeButton.click();
        await page.getByRole("button", { name: `${testChannelType}` }).click();
        await page.locator(`input:below(:text('${testChannelType}'))`).fill(testChannelAccountName);
        await notificationsPage.modalActionDeliveryChannelButton("Add").click();
        await expect(page.getByText(testChannelAccountName)).toBeVisible();
    });
    await test.step("Edit existing delivery channel", async () => {
        notificationsPage.deliveryChannelItem(testChannelAccountName).click();
        await notificationsPage.modalSelectChannelTypeButton.click();
        const testChannelType = "Telegram";
        await page.getByRole("button", { name: `${testChannelType}` }).click();
        await page.locator(`input:below(:text('${testChannelType}'))`).clear();
        await page
            .locator(`input:below(:text('${testChannelType}'))`)
            .fill(testChannelAccountNameEdited);
        await notificationsPage.modalActionDeliveryChannelButton("Save").click();
    });
    await test.step("Add subscription", async () => {
        await notificationsPage.addSubscriptionButton.click();
        await notificationsPage.modalSelectDeliveryChannelButton.click();
        await page.locator(`button:has-text("${testChannelAccountNameEdited}")`).click();
        await page.locator("[data-tid='Tag dropdown select']").click();
        await page.locator(`[data-tid='Tag ${testTag}']`).click();
        await notificationsPage.modalActionDeliveryChannelButton("Add").click();
    });

    await test.step("Delete subscription", async () => {
        await page.getByText(testChannelAccountNameEdited).nth(1).click();
        await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    });

    await test.step("Delete delivery channel", async () => {
        await page.getByText(testChannelAccountNameEdited).first().click();
        await notificationsPage.modalActionDeliveryChannelButton("Delete").click();
    });
});
