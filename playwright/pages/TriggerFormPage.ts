import { Locator, Page } from "@playwright/test";

export class TriggerFormPage {
    readonly page: Page;
    readonly createTriggerButton: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly targetInput: Locator;
    readonly addTargetButton: Locator;
    readonly tagsInput: Locator;
    readonly tagBadge: (tagName: string) => Locator;
    readonly warnRisingValueInput: Locator;
    readonly errorRisingValueInput: Locator;
    readonly warnFallingValueInput: Locator;
    readonly errorFallingValueInput: Locator;
    readonly simpleModeFallingRadio: Locator;
    readonly expressionInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator("[data-tid=Name]");
        this.descriptionInput = page.locator("[data-tid=Description]");
        this.targetInput = page.locator("[data-tid=Target]");
        this.addTargetButton = page.locator("button", { hasText: "Add one more" });
        this.tagsInput = page.locator("[data-tid=Tags]");
        this.tagBadge = (tagName) =>
            this.page.locator("[data-tid=Tag]", { hasText: new RegExp(tagName) });
        this.createTriggerButton = page.locator("button", { hasText: "Add Trigger" });
        this.warnRisingValueInput = page.locator("[data-tid='Warn Rising']");
        this.errorRisingValueInput = page.locator("[data-tid='Error Rising']");
        this.warnFallingValueInput = page.locator("[data-tid='Warn Falling']");
        this.errorFallingValueInput = page.locator("[data-tid='Error Falling']");
        this.simpleModeFallingRadio = page.locator("text=Watch for value falling");
        this.expressionInput = page.locator("[data-tid='Expression']");
    }
}
