import { Locator, Page } from "@playwright/test";

export class MainPage {
    readonly page: Page;
    readonly addTriggerButton: Locator;
    readonly teamsLink: Locator;
    readonly notificationsLink: Locator;
    readonly helpLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTriggerButton = page.getByRole("link", { name: "Add Trigger" });
        this.teamsLink = page.getByRole("link", { name: "Teams" });
        this.notificationsLink = page.getByRole("link", { name: "Notifications" });
        this.helpLink = page.getByRole("link", { name: "Help" });
    }

    async gotoMainPage(): Promise<void> {
        await this.page.goto("/");
    }
}
