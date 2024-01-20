import { test, expect } from "@playwright/test";
import { clearDatabase } from "../../src/tests/core/utils";
import { TeamsPage } from "../pages/teams.page";

test.afterAll(async () => {
    await clearDatabase();
});

let TEAM_NAME = "test team name";
let TEAM_DESCRIPTION = "test team description";
let USER_NAME = "test user name";

test.describe.serial("TeamsPage", () => {
    test("Teams operations", async ({ page }) => {
        const teamsPage = new TeamsPage(page);
        await test.step("Add team", async () => {
            await teamsPage.gotoTeamsPage();
            await expect(page).toHaveURL("/teams");
            await teamsPage.addTeamButton.click();
            await teamsPage.nameInput("Team name").fill(TEAM_NAME);
            await teamsPage.teamDescription.fill(TEAM_DESCRIPTION);
            await teamsPage.previewButton.click();
            await expect(teamsPage.nameInput("Team name")).toHaveAttribute("value", TEAM_NAME);
            await expect(page.getByText(TEAM_DESCRIPTION)).toBeVisible();

            Promise.all([
                await page.locator("[data-tid='Confirm add team']").click(),
                await page.waitForResponse(
                    (response) =>
                        response.url() === "http://localhost:9000/api/teams" &&
                        response.status() === 200
                ),
            ]);
        });
        await test.step("Edit existing team", async () => {
            await teamsPage.editDescriptionButton.click();
            await expect(teamsPage.nameInput("Team name")).not.toBeVisible();
            await expect(teamsPage.teamDescription).toContainText(TEAM_DESCRIPTION);

            TEAM_DESCRIPTION += " changed";
            await teamsPage.teamDescription.fill(TEAM_DESCRIPTION);
            await page.getByRole("button", { name: "Save" }).click();
        });
        await test.step("Add user", async () => {
            await teamsPage.showUsersButton.click();
            await page.locator("text=Add User").click();
            await expect(page.getByText(`Add User to ${TEAM_NAME}`)).toBeVisible();
            await teamsPage.nameInput("User name").fill(USER_NAME);
            await teamsPage.addUserModalButton.click();
        });
    });
});
