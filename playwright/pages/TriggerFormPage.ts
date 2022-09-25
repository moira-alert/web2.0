import { Locator, Page } from "@playwright/test";

export class TriggerFormPage {
    readonly page: Page;
    readonly createTriggerButton: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly targetInput: (number: number) => Locator;
    readonly addTargetButton: Locator;
    readonly tagsInput: Locator;
    readonly tagBadge: (tagName: string) => Locator;
    readonly targetValueInput: (level: string, direction: string) => Locator;
    readonly simpleModeFallingRadio: Locator;
    readonly expressionInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.nameInput = page.locator("[data-tid='name']");

        this.descriptionInput = page.locator("[data-tid='description']");

        this.targetInput = (number) => page.locator(`[data-tid='target_${number}']`);

        this.addTargetButton = page.locator("button", { hasText: "Add one more" });

        this.tagsInput = page.locator("[data-tid='tags']");

        this.tagBadge = (tagName) => page.locator("button", { hasText: new RegExp(tagName) });

        this.createTriggerButton = page.locator("button", { hasText: "Add Trigger" });

        this.targetValueInput = (level, direction) =>
            page.locator(
                `[data-tid='${level}']:below(:text('Watch for value ${direction}:'), 120)`
            );

        this.simpleModeFallingRadio = page.locator("text=Watch for value falling");

        this.expressionInput = page.locator("[data-tid='expression']");
    }
}
