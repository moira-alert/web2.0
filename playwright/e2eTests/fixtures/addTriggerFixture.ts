import { test as base, Page } from "@playwright/test";
import { TriggerForm } from "../../pages/triggerForm";

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
    testTriggerDescription: "test trigger description",
    testTag: "testTag",
    testExpression: "t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)",
    testTeamName: "test team name",
    testTeamDescription: "test team description",
    testUserName: "test user name",
    testChannelType: "E-mail",
    testChannelAccountName: "testmail@test.com",
});

export default test;
export const expect = test.expect;
