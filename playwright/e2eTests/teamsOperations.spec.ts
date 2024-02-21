import { test as base, expect } from "@playwright/test";
import { TeamsPage } from "../pages/teams.page";

const test = base.extend<{
    teamName: string;
    teamDescription: string;
    userName: string;
    teamsPage: TeamsPage;
}>({
    teamName: "test team name",
    teamDescription: "test team description",
    userName: "test user name",
    teamsPage: async ({ page }, use) => {
        const teamsPage = new TeamsPage(page);
        await teamsPage.gotoTeamsPage();
        await use(teamsPage);
    },
});

test.describe.configure({ mode: "serial" });

test("Add team", async ({ page, teamName, teamDescription, teamsPage }) => {
    await expect(page).toHaveURL("/teams");
    await teamsPage.addTeamButton.click();
    await teamsPage.nameInput("Team name").fill(teamName);
    await teamsPage.teamDescription.fill(teamDescription);
    await teamsPage.previewButton.click();
    await expect(teamsPage.nameInput("Team name")).toHaveAttribute("value", teamName);
    await expect(page.getByText(teamDescription)).toBeVisible();

    const addTeamPromise = page.waitForResponse(/api\/teams/);
    await page.locator("[data-tid='Confirm add team']").click();
    await addTeamPromise;
    await expect(page.getByText(teamName)).toBeVisible();
});

test("Edit team description", async ({ page, teamDescription, teamsPage, teamName }) => {
    await teamsPage.editTeamButton.click();
    await expect(teamsPage.nameInput("Team name")).toHaveValue(teamName);
    await expect(teamsPage.teamDescription).toContainText(teamDescription);
    await teamsPage.teamDescription.fill(teamDescription + " changed");
    await teamsPage.nameInput("Team name").fill(teamName + " changed");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText(teamDescription + " changed")).toBeVisible();
    await expect(page.getByText(teamName + " changed")).toBeVisible();
});

test("Add user", async ({ page, teamName, userName, teamsPage }) => {
    await teamsPage.showUsersButton.click();
    await page.locator("text=Add User").click();
    await expect(page.getByText(`Add User to ${teamName}`)).toBeVisible();
    await teamsPage.nameInput("User name").fill(userName);
    await teamsPage.addUserModalButton.click();
    await expect(page.getByText(userName)).toBeVisible();
});

test("Delete user", async ({ page, userName, teamsPage }) => {
    await teamsPage.showUsersButton.click();
    await teamsPage.deleteUserButton(userName).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
        page.locator(`:text("${userName}"):right-of(span[data-tid='Delete user ${userName}'])`)
    ).not.toBeVisible();
});

test("Delete team", async ({ page, teamName, teamsPage }) => {
    await teamsPage.deleteTeamButton(teamName + " changed").click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
        page.locator(`:text("${teamName}"):right-of(span[data-tid='Delete team ${teamName}'])`)
    ).not.toBeVisible();
});
