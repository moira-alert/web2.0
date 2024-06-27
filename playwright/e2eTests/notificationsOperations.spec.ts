import { expect, test as base } from "@playwright/test";
import { NotificationsPage } from "../pages/notifications.page";

const ConfigContacts = [
    {
        type: "mail",
        label: "E-mail",
    },
    {
        type: "pushover",
        label: "Pushover",
    },
    {
        type: "slack",
        label: "Slack",
    },
    {
        type: "telegram",
        label: "Telegram",
        help: "required to grant @MoiraBot admin privileges",
    },
    {
        type: "twilio sms",
        label: "Twilio SMS",
    },
    {
        type: "twilio voice",
        label: "Twilio voice",
    },
];

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

test("With feature flags set to true", async ({ notificationsPage, page }) => {
    await page.route("api/config", (route) => {
        route.fulfill({
            json: {
                remoteAllowed: true,
                contacts: ConfigContacts,
                featureFlags: {
                    isSubscriptionToAllTagsAvailable: true,
                    isPlottingAvailable: true,
                    isPlottingDefaultOn: true,
                },
            },
        });
    });

    await notificationsPage.gotoNotificationsPage();
    await notificationsPage.addSubscriptionButton.click();

    const addGraphCheckbox = page.locator('label:has-text("Add graph to notification")');
    const allTagsToggle = page.locator('text="All tags"');

    await expect(allTagsToggle).toBeVisible();
    await expect(addGraphCheckbox).toBeVisible();
    await expect(addGraphCheckbox.locator("> input")).toBeChecked();
});

test("With feature flags set to false", async ({ notificationsPage, page }) => {
    await page.route("api/config", (route) => {
        route.fulfill({
            json: {
                remoteAllowed: true,
                contacts: ConfigContacts,
                featureFlags: {
                    isSubscriptionToAllTagsAvailable: false,
                    isPlottingAvailable: false,
                    isPlottingDefaultOn: false,
                },
            },
        });
    });

    await notificationsPage.gotoNotificationsPage();
    await notificationsPage.addSubscriptionButton.click();

    const addGraphCheckbox = page.locator('label:has-text("Add graph to notification")');
    const allTagsToggle = page.locator('text="All tags"');

    await expect(allTagsToggle).not.toBeVisible();
    await expect(addGraphCheckbox).not.toBeVisible();
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
    await page.locator(`input:below(:text('${channelType}'))`).first().fill(channelAccountName);
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
    await page.locator(`input:below(:text('${channelTypeEdited}'))`).nth(0).clear();
    await page
        .locator(`input:below(:text('${channelTypeEdited}'))`)
        .first()
        .fill(channelAccountNameEdited);
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
    await expect(notificationsPage.modalActionDeliveryChannelButton("Delete")).toHaveAttribute(
        "disabled"
    );
    await page.locator('button[aria-label="Close modal window"]').click();
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
