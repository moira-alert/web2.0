import { Locator, Page } from "@playwright/test";

export class TriggerFormPage {
    readonly page: Page;
    readonly createTriggerButton: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly targetInput: Locator;
    readonly tagsInput: Locator;
    readonly warnValueInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator("[data-tid=Name]");
        this.descriptionInput = page.locator("[data-tid=Description]");
        this.targetInput = page.locator("[data-tid='Target T1']");
        this.tagsInput = page.locator("[data-tid=Tags]");
        this.createTriggerButton = page.locator("button", { hasText: "Add Trigger" });
        this.warnValueInput = page.locator("[data-tid='WARN T1']");
    }

    getTagBadgeByName(tagName: string): Locator {
        const regex = new RegExp(tagName);
        return this.page.locator("[data-tid=Tag]", { hasText: regex });
    }

    getMessageNear(locator: Locator, text: string): Locator {
        const [, selector] = locator.toString().split("@");
        return this.page.locator(`:text("${text}"):near(${selector})`);
    }
}
