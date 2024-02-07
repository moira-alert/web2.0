import { Locator, Page } from "@playwright/test";

export class TriggerInfoPage {
    readonly page: Page;
    readonly triggerId: string | undefined;
    readonly editButton: Locator;
    readonly target: (targetIndex: number) => Locator;
    readonly menuListButton: Locator;
    readonly duplicateButton: Locator;
    readonly deleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.editButton = page.locator("[data-tid='Edit']");
        this.target = (targetIndex) => page.locator(`[data-tid=T${targetIndex}]`);
        this.menuListButton = page.getByText("Other");
        this.duplicateButton = page.getByText("Duplicate");
        this.deleteButton = page.getByText("Delete");
    }
}
