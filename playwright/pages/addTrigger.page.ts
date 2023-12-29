import { Page } from "@playwright/test";

export class AddTriggerPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoAddTriggerPage(): Promise<void> {
        await this.page.goto("/trigger/new");
    }
}
