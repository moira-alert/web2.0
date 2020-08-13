import { clearDatabase } from "./core/utils";
import { AddTriggerPage } from "./pages/AddTriggerPage";
import { TriggerViewPage } from "./pages/TriggerViewPage";

describe("Add trigger page", () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it(`create new trigger`, async () => {
        const addTriggerPage = new AddTriggerPage(page);
        await addTriggerPage.open();
        await addTriggerPage.Name.type("trigger name");
        await addTriggerPage.TargetT1.type("sumSeries(test.target.*)");
        await addTriggerPage.WarnT1.type("10");
        await addTriggerPage.Tags.addTag("test");
        await addTriggerPage.AddTrigger.click();

        const triggerViewPage = new TriggerViewPage(page);
        await expect(triggerViewPage.isOpen()).resolves.toEqual(true);
        await expect(triggerViewPage.Name).resolves.toEqual("trigger name");
    }, 30000);
});
