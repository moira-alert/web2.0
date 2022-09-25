import { test, expect } from "@playwright/test";
import { TeamsPage } from "./pages/TeamsPage";
import { clearDatabase } from "./utils";

test.afterAll(async () => clearDatabase());

test("test", async ({ page }) => {
    const teamsPage = new TeamsPage(page);
    await teamsPage.goto();
    await teamsPage.addTeamButton.click();

    await teamsPage.teamNameInput.fill("test team");
    await teamsPage.teamDescriptionInput.fill("test description");
    await teamsPage.saveTeamButton.click();

    await expect(page.locator("text=test team")).toBeVisible();
    await expect(page.locator("text=test description")).toBeVisible();

    await teamsPage.showUsersButton.click();
    await page.locator("text=Add User").click();

    await teamsPage.userNameInput.fill("test user");
    await teamsPage.addUserButton.highlight();
    await teamsPage.addUserButton.click();
    await expect(page.locator("text=test user")).toBeVisible();

    await teamsPage.deleteUserButton("test user").click();
    await expect(page.locator('text=Exclude "test user" from "test team"?')).toBeVisible();
    await page.locator("text=Confirm").click();
    await expect(page.locator("text=test user")).not.toBeVisible();

    await teamsPage.editTeamButton.click();
    await expect(page.locator("text=Edit team test team")).toBeVisible();
    await expect(teamsPage.teamDescriptionInput).toHaveValue("test description");
    await teamsPage.teamDescriptionInput.fill("test description updated");
    await teamsPage.saveTeamButton.click();
    await expect(page.locator("text=test description updated")).toBeVisible();

    await teamsPage.deleteTeamButton.click();
    await expect(page.locator('text=Do you really want to remove "test team" team?')).toBeVisible();
    await Promise.all([
        page.waitForResponse(/teams\/[a-z\d]+-+/),
        page.locator("text=Confirm").click(),
    ]);
    await page.waitForTimeout(1000); // TODO: remove hard waits
    await expect(page.locator("text=test team")).not.toBeVisible();
});
