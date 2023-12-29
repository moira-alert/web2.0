import { Locator, Page } from "@playwright/test";

export class TriggerInfoPage {
    readonly page: Page;
    readonly triggerId: string | undefined;
    readonly editButton: Locator;
    readonly target: (targetIndex: number) => Locator;
    readonly duplicateButton: Locator;

    constructor(page: Page, triggerId?: string) {
        this.page = page;
        this.triggerId = triggerId;
        this.editButton = page.locator("[data-tid='Edit']");
        this.target = (targetIndex) => page.locator(`[data-tid=T${targetIndex}]`);
        this.duplicateButton = page.getByText("Duplicate");
    }

    async gotoTriggerInfoPage(): Promise<void> {
        await this.page.goto(`/trigger/${this.triggerId}`);
    }
}
