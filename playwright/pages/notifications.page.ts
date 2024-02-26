import { Page, Locator } from "@playwright/test";

export class NotificationsPage {
    readonly page: Page;
    readonly addDeliveryChannelButton: Locator;
    readonly addSubscriptionButton: Locator;
    readonly modalSelectChannelTypeButton: Locator;
    readonly modalSelectDeliveryChannelButton: Locator;
    readonly modalActionDeliveryChannelButton: (action: "Add" | "Save" | "Delete") => Locator;
    readonly deliveryChannelItem: (value: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.addDeliveryChannelButton = page.getByRole("button", {
            name: "Add delivery channel",
            exact: true,
        });
        this.modalSelectChannelTypeButton = page.locator("[data-tid='Select channel type']");
        this.modalActionDeliveryChannelButton = (action) =>
            page.getByRole("button", { name: `${action}`, exact: true });
        this.modalSelectDeliveryChannelButton = page.locator(
            "[data-tid='Select delivery channel']"
        );
        this.deliveryChannelItem = (value) => page.locator(`td:has-text("${value}")`);
        this.addSubscriptionButton = page.getByRole("button", {
            name: "Add subscription",
            exact: true,
        });
    }

    async gotoNotificationsPage(): Promise<void> {
        await this.page.goto("/settings");
    }
}
