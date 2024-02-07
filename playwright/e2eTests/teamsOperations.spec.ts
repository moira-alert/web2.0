import { test as base, expect } from "@playwright/test";
import { TeamsPage } from "../pages/teams.page";

const test = base.extend<{
    testTeamName: string;
    testTeamDescription: string;
    testUserName: string;
}>({
    testTeamName: "test team name",
    testTeamDescription: "test team description",
    testUserName: "test user name",
});

test("Teams operations", async ({ page, testTeamName, testTeamDescription, testUserName }) => {
    const teamsPage = new TeamsPage(page);
    await test.step("Add team", async () => {
        await teamsPage.gotoTeamsPage();
        await expect(page).toHaveURL("/teams");
        await teamsPage.addTeamButton.click();
        await teamsPage.nameInput("Team name").fill(testTeamName);
        await teamsPage.teamDescription.fill(testTeamDescription);
        await teamsPage.previewButton.click();
        await expect(teamsPage.nameInput("Team name")).toHaveAttribute("value", testTeamName);
        await expect(page.getByText(testTeamDescription)).toBeVisible();

        const addTeamPromise = page.waitForResponse(/api\/teams/);
        await page.locator("[data-tid='Confirm add team']").click();
        await addTeamPromise;
        await expect(page.getByText(testTeamName)).toBeVisible();
    });
    await test.step("Edit team description", async () => {
        await teamsPage.editDescriptionButton.click();
        await expect(teamsPage.nameInput("Team name")).not.toBeVisible();
        await expect(teamsPage.teamDescription).toContainText(testTeamDescription);
        await teamsPage.teamDescription.fill(testTeamDescription + " changed");
        await page.getByRole("button", { name: "Save" }).click();
        await expect(page.getByText(testTeamDescription + " changed")).toBeVisible();
    });
    await test.step("Add user", async () => {
        await teamsPage.showUsersButton.click();
        await page.locator("text=Add User").click();
        await expect(page.getByText(`Add User to ${testTeamName}`)).toBeVisible();
        await teamsPage.nameInput("User name").fill(testUserName);
        await teamsPage.addUserModalButton.click();
        await expect(page.getByText(testUserName)).toBeVisible();
    });
    await test.step("Delete user", async () => {
        await teamsPage.deleteUserButton(testUserName).click();
        await page.getByRole("button", { name: "Confirm" }).click();
        await expect(
            page.locator(
                `:text("${testUserName}"):right-of(span[data-tid='Delete user ${testUserName}'])`
            )
        ).not.toBeVisible();
    });
    await test.step("Delete team", async () => {
        await teamsPage.deleteTeamButton(testTeamName).click();
        await page.getByRole("button", { name: "Confirm" }).click();
        await expect(
            page.locator(
                `:text("${testTeamName}"):right-of(span[data-tid='Delete team ${testTeamName}'])`
            )
        ).not.toBeVisible();
    });
});
