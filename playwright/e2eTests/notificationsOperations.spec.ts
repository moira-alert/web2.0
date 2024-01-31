import test from "./fixtures/addTriggerFixture";
import { NotificationsPage } from "../pages/notifications.page";

test("Notifications operations", async ({
    testChannelType,
    testChannelAccountName,
    testTag,
    addTrigger,
}) => {
    const { page } = addTrigger;
    const notificationsPage = new NotificationsPage(page);
    await test.step("Add delivery channel", async () => {
        await notificationsPage.gotoNotificationsPage();
        await notificationsPage.addDeliveryChannelButton.click();
        await notificationsPage.modalSelectChannelTypeButton.click();
        await page.getByRole("button", { name: `${testChannelType}` }).click();
        await page.locator(`input:below(:text('${testChannelType}'))`).fill(testChannelAccountName);
        await notificationsPage.modalActionDeliveryChannelButton("Add").click();
    });
    await test.step("Edit existing delivery channel", async () => {
        notificationsPage.deliveryChannelItem(testChannelAccountName).click();
        await notificationsPage.modalSelectChannelTypeButton.click();
        testChannelType = "Telegram";
        await page.getByRole("button", { name: `${testChannelType}` }).click();
        testChannelAccountName = "#testtelegramaccount";
        await page.locator(`input:below(:text('${testChannelType}'))`).clear();
        await page.locator(`input:below(:text('${testChannelType}'))`).fill(testChannelAccountName);
        await notificationsPage.modalActionDeliveryChannelButton("Save").click();
    });
    await test.step("Add subscription", async () => {
        await notificationsPage.addSubscriptionButton.click();
        await notificationsPage.modalSelectDeliveryChannelButton.click();
        await page.locator(`button:has-text("${testChannelAccountName}")`).click();
        await page.locator("[data-tid='Tag dropdown select']").click();
        await page.locator(`[data-tid='Tag ${testTag}']`).click();
        await notificationsPage.modalActionDeliveryChannelButton("Add").click();
    });
});
