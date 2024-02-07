import { test as base, expect } from "@playwright/test";
import { TeamsPage } from "../pages/teams.page";

const test = base.extend<{
    teamName: string;
    teamDescription: string;
    userName: string;
}>({
    teamName: "test team name",
    teamDescription: "test team description",
    userName: "test user name",
});

test("Teams operations", async ({ page, teamName, teamDescription, userName }) => {
    const teamsPage = new TeamsPage(page);
    await test.step("Add team", async () => {
        await teamsPage.gotoTeamsPage();
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

    await test.step("Edit team description", async () => {
        await teamsPage.editDescriptionButton.click();
        await expect(teamsPage.nameInput("Team name")).not.toBeVisible();
        await expect(teamsPage.teamDescription).toContainText(teamDescription);
        await teamsPage.teamDescription.fill(teamDescription + " changed");
        await page.getByRole("button", { name: "Save" }).click();
        await expect(page.getByText(teamDescription + " changed")).toBeVisible();
    });

    await test.step("Add user", async () => {
        await teamsPage.showUsersButton.click();
        await page.locator("text=Add User").click();
        await expect(page.getByText(`Add User to ${teamName}`)).toBeVisible();
        await teamsPage.nameInput("User name").fill(userName);
        await teamsPage.addUserModalButton.click();
        await expect(page.getByText(userName)).toBeVisible();
    });

    await test.step("Delete user", async () => {
        await teamsPage.deleteUserButton(userName).click();
        await page.getByRole("button", { name: "Confirm" }).click();
        await expect(
            page.locator(`:text("${userName}"):right-of(span[data-tid='Delete user ${userName}'])`)
        ).not.toBeVisible();
    });

    await test.step("Delete team", async () => {
        await teamsPage.deleteTeamButton(teamName).click();
        await page.getByRole("button", { name: "Confirm" }).click();
        await expect(
            page.locator(`:text("${teamName}"):right-of(span[data-tid='Delete team ${teamName}'])`)
        ).not.toBeVisible();
    });
});
