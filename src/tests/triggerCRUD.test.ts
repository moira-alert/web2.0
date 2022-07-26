import { clearDatabase } from "./core/utils";
import { TriggerViewPage } from "./pages/TriggerViewPage";
import { AddTriggerPage } from "./pages/AddTriggerPage";
import { EditTriggerPage } from "./pages/EditTriggerPage";
import { MainPage } from "./pages/MainPage";

describe("Create/update/delete trigger", () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it("create trigger", async () => {
        const addTriggerPage = new AddTriggerPage(page);
        const triggerViewPage = new TriggerViewPage(page);

        await addTriggerPage.open();
        await addTriggerPage.Name.type("trigger name");
        await addTriggerPage.AddTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(false);

        await addTriggerPage.TargetT1.type("ttttt");
        await addTriggerPage.WarnT1.type("10");
        await addTriggerPage.Tags.addTag("test");
        await addTriggerPage.AddTrigger.click();
        await expect(
            addTriggerPage.hasTextInElement(
                "Function is not supported",
                `[data-tid="Error Message"]`
            )
        ).resolves.toEqual(true);
        await expect(triggerViewPage.isOpen()).resolves.toEqual(false);

        await addTriggerPage.TargetT1.clear();
        await addTriggerPage.TargetT1.type("sumSeries(test.target.*)");

        await addTriggerPage.AddTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(true);

        await expect(triggerViewPage.Name).resolves.toEqual("trigger name");
    }, 60000);

    it("edit trigger", async () => {
        const triggerViewPage = new TriggerViewPage(page);
        const editTriggerPage = new EditTriggerPage(page);

        await triggerViewPage.Edit.click();

        await editTriggerPage.TargetT1.clear();
        await editTriggerPage.TargetT1.type("ttttt");
        await editTriggerPage.SaveTrigger.click();
        await expect(
            editTriggerPage.hasTextInElement(
                "Function is not supported",
                `[data-tid="Error Message"]`
            )
        ).resolves.toEqual(true);
        await expect(triggerViewPage.isOpen()).resolves.toEqual(false);

        await editTriggerPage.WarnT1.clear();
        await editTriggerPage.SaveTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(false);

        await editTriggerPage.WarnT1.type("10");
        await editTriggerPage.TargetT1.clear();
        await editTriggerPage.TargetT1.type("sumSeries(test.target.*)");
        await editTriggerPage.Name.type(" edited");

        await editTriggerPage.SaveTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(true);
        await expect(triggerViewPage.Name).resolves.toEqual("trigger name edited");
    }, 60000);

    it("delete trigger", async () => {
        const triggerViewPage = new TriggerViewPage(page);
        const editTriggerPage = new EditTriggerPage(page);
        const mainPage = new MainPage(page);

        await triggerViewPage.Edit.click();

        await editTriggerPage.OpenDeleteModal.click();
        await expect(
            editTriggerPage.hasTextInElement(
                "trigger name edited",
                `[data-tid="Delete Trigger Modal Body"]`
            )
        ).resolves.toEqual(true);

        await editTriggerPage.CloseDeleteModal.click();
        await expect(
            editTriggerPage.hasTextInElement(
                "trigger name edited",
                `[data-tid="Delete Trigger Modal Body"]`
            )
        ).rejects;

        await editTriggerPage.OpenDeleteModal.click();
        await editTriggerPage.DeleteTrigger.click();
        await expect(mainPage.isOpen()).resolves.toEqual(true);
    }, 60000);
});
