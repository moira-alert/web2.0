import { test as base, Page } from "@playwright/test";
import { TriggerForm } from "../../pages/triggerForm";
// import { MainPage } from "../../pages/main.page";

interface IFixtures {
    testTag: string;
    testTriggerName: string;
    testExpression: string;
    testTeamName: string;
    testTeamDescription: string;
    testUserName: string;
    testChannelType: string;
    testChannelAccountName: string;
    testTriggerDescription: string;
    triggerForm: TriggerForm;
}

interface IAddTriggerFixture {
    addTrigger: { page: Page; testTriggerID: string };
}
const test = base.extend<IFixtures, IAddTriggerFixture>({
    testTriggerName: "test trigger name",
    testTag: "testTag",
    testExpression: "t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)",
    testTeamName: "test team name",
    testTeamDescription: "test team description",
    testUserName: "test user name",
    testChannelType: "E-mail",
    testChannelAccountName: "testmail@test.com",
    testTriggerDescription: "test trigger description",
    // addTrigger: [
    //     async ({ browser }, use) => {
    //         const page = await browser.newPage();
    //         const mainPage = new MainPage(page);
    //         const triggerForm = new TriggerForm(page);
    //         await mainPage.gotoMainPage();
    //         await mainPage.addTriggerButton.click();
    //         await expect(page).toHaveURL("/trigger/new");
    //         await triggerForm.triggerNameField.fill("test trigger name");
    //         await triggerForm.descriptionField.fill("test trigger description");
    //         await triggerForm.target(1).click();
    //         await triggerForm.target(1).pressSequentially("testmetric");
    //         await triggerForm.warnValue.fill("1");
    //         await triggerForm.errorValue.fill("2");
    //         await triggerForm.addTag();
    //         await triggerForm.submitButton("Add").click();
    //         //getting triggerID for subsequent tests
    //         const response = await page.waitForResponse(/api\/trigger/);
    //         const responseBody = await response.json();

    //         await use({ page, testTriggerID: responseBody.id });
    //     },
    //     { scope: "worker" },
    // ],
    triggerForm: async ({ page }, use) => {
        await use(new TriggerForm(page));
    },
});
export default test;
export const expect = test.expect;
