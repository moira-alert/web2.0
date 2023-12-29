import { Locator, Page } from "@playwright/test";

type action = "Add" | "Save" | "Duplicate";

export class TriggerForm {
    readonly page: Page;
    readonly submitButton: (action: action) => Locator;
    readonly triggerNameField: Locator;
    readonly descriptionField: Locator;
    readonly target: (targetIndex: number) => Locator;
    readonly warnValue: Locator;
    readonly errorValue: Locator;
    readonly tagsField: Locator;
    readonly newTagButton: Locator;
    readonly graphiteLocalRadio: Locator;
    readonly graphiteRemoteRadio: Locator;
    readonly prometheusRemoteRadio: Locator;
    readonly addTargetButton: Locator;
    readonly advancedModeTab: Locator;
    readonly simpleModeTab: Locator;
    readonly deleteTarget: (targetIndex: number) => Locator;
    readonly expressionField: Locator;
    readonly statusSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.submitButton = (action) => page.locator(`[data-tid="${action} Trigger"]`);
        this.triggerNameField = page.locator("label[data-tid='Name'] > span > input");
        this.descriptionField = page.locator("[data-tid='Description']");
        this.target = (targetIndex) => page.locator(`[data-tid=T${targetIndex}]`);
        this.warnValue = page.locator("[data-tid='WARN T1']");
        this.errorValue = page.locator("[data-tid='ERROR T1']");
        this.tagsField = page.locator("[data-tid='Tags']");
        this.newTagButton = page.locator("[data-tid='New Tag']");
        this.graphiteLocalRadio = page.locator("[data-tid='Graphite local']");
        this.graphiteRemoteRadio = page.locator("[data-tid='Graphite remote']");
        this.prometheusRemoteRadio = page.locator("[data-tid='Prometheus remote']");
        this.addTargetButton = page.getByText("Add one more");
        this.advancedModeTab = page.getByText("Advanced mode");
        this.simpleModeTab = page.getByText("Simple mode");
        this.deleteTarget = (targetIndex) =>
            page.locator(`[data-tid='Target remove ${targetIndex}']`);
        this.expressionField = page.getByPlaceholder("t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)");
        this.statusSelect = page.locator("[data-tid='Status select dropdown']");
    }
}
