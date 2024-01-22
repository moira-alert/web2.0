import { test } from "@playwright/test";
import { clearDatabase } from "../../src/tests/core/utils";
import { NotificationsPage } from "../pages/notifications.page";

test.afterAll(async () => {
    await clearDatabase();
});

let TEST_CHANNEL_TYPE = "E-mail";
let TEST_CHANNEL_ACCOUNT_NAME = "testmail@test.com";
let TEST_TAG = "testTag";

test.describe("NotificationsPage", () => {
    test("Notifications operations", async ({ page }) => {
        const notificationsPage = new NotificationsPage(page);
        await test.step("Add delivery channel", async () => {
            await notificationsPage.gotoNotificationsPage();
            await notificationsPage.addDeliveryChannelButton.click();
            await notificationsPage.modalSelectChannelTypeButton.click();
            await page.getByRole("button", { name: `${TEST_CHANNEL_TYPE}` }).click();
            await page
                .locator(`input:below(:text('${TEST_CHANNEL_TYPE}'))`)
                .fill(TEST_CHANNEL_ACCOUNT_NAME);
            await notificationsPage.modalActionDeliveryChannelButton("Add").click();
        });
        await test.step("Edit existing delivery channel", async () => {
            notificationsPage.deliveryChannelItem(TEST_CHANNEL_ACCOUNT_NAME).click();
            await notificationsPage.modalSelectChannelTypeButton.click();
            TEST_CHANNEL_TYPE = "Telegram";
            await page.getByRole("button", { name: `${TEST_CHANNEL_TYPE}` }).click();
            TEST_CHANNEL_ACCOUNT_NAME += "changed";
            await page
                .locator(`input:below(:text('${TEST_CHANNEL_TYPE}'))`)
                .fill(TEST_CHANNEL_ACCOUNT_NAME);
            await notificationsPage.modalActionDeliveryChannelButton("Save").click();
        });
        await test.step("Add subscription", async () => {
            await notificationsPage.addSubscriptionButton.click();
            await notificationsPage.modalSelectDeliveryChannelButton.click();
            await page.locator(`button:has-text("${TEST_CHANNEL_ACCOUNT_NAME}")`).click();
            await page.locator("[data-tid='Tag dropdown select']").click();
            await page.locator(`[data-tid='Tag ${TEST_TAG}']`).click();
            await page.getByRole("button", { name: "Add" }).click();
        });
    });
});
