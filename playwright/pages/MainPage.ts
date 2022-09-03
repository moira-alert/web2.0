import { Locator, Page } from "@playwright/test";

export class MainPage {
    readonly page: Page;
    readonly addTriggerButton: Locator;
    readonly teamsLink: Locator;
    readonly notificationsLink: Locator;
    readonly helpLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTriggerButton = page.locator("text=Add Trigger");
        this.teamsLink = page.locator("text=Teams");
        this.notificationsLink = page.locator("text=Notifications");
        this.helpLink = page.locator("text=Help");
    }

    async goto(): Promise<void> {
        await this.page.goto("/");
    }
}
