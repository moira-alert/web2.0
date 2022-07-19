import { clearDatabase } from "./core/utils";
import { TriggerViewPage } from "./pages/TriggerViewPage";
import { AddTriggerPage } from "./pages/AddTriggerPage";
import { EditTriggerPage } from "./pages/EditTriggerPage";

describe("Create/edit trigger", () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it(`create new trigger`, async () => {
        const addTriggerPage = new AddTriggerPage(page);
        const triggerViewPage = new TriggerViewPage(page);

        await addTriggerPage.open();
        await addTriggerPage.Name.type("trigger name");
        await addTriggerPage.AddTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(false);

        await addTriggerPage.TargetT1.type("ttttt");
        await addTriggerPage.AddTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(false);

        await addTriggerPage.TargetT1.clear();
        await addTriggerPage.TargetT1.type("sumSeries(test.target.*)");
        await addTriggerPage.WarnT1.type("10");
        await addTriggerPage.Tags.addTag("test");

        await addTriggerPage.AddTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(true);

        await expect(triggerViewPage.Name).resolves.toEqual("trigger name");
    }, 60000);

    it(`edit trigger`, async () => {
        const triggerViewPage = new TriggerViewPage(page);
        const editTriggerPage = new EditTriggerPage(page);

        await triggerViewPage.Edit.click();
        await editTriggerPage.Name.type(" edited");

        await editTriggerPage.SaveTrigger.click();
        await expect(triggerViewPage.isOpen()).resolves.toEqual(true);
        await expect(triggerViewPage.Name).resolves.toEqual("trigger name edited");
    }, 60000);
});
