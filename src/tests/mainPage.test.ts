import { clearDatabase } from "./core/utils";
import { AddTriggerPage } from "./pages/AddTriggerPage";
import { MainPage } from "./pages/MainPage";

describe("Main Page", () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it(`open Add trigger page by click on "Add Trigger" `, async () => {
        const mainPage = new MainPage(page);
        await mainPage.open();
        await mainPage.AddTrigger.click();
        const addTriggerPage = new AddTriggerPage(page);
        await expect(addTriggerPage.isOpen()).resolves.toEqual(true);
    }, 60000);
});
