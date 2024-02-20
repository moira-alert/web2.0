import { Locator, Page } from "@playwright/test";

export class TeamsPage {
    readonly page: Page;
    readonly addTeamButton: Locator;
    readonly nameInput: (testId: string) => Locator;
    readonly teamDescription: Locator;
    readonly previewButton: Locator;
    readonly editTeamButton: Locator;
    readonly showUsersButton: Locator;
    readonly addUserModalButton: Locator;
    readonly deleteUserButton: (userName: string) => Locator;
    readonly deleteTeamButton: (teamName: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTeamButton = page.getByText("Add team");
        this.nameInput = (testId) => page.locator(`label[data-tid='${testId}'] > span > input`);
        this.teamDescription = page.locator("[data-tid='Team description']");
        this.previewButton = page.getByText("Preview");
        this.editTeamButton = page.getByRole("button", { name: "Edit Team" });
        this.showUsersButton = page.getByText("Show users");
        this.addUserModalButton = page.locator("[data-tid='Add user modal']");
        this.deleteUserButton = (userName) => page.locator(`[data-tid="Delete user ${userName}"]`);
        this.deleteTeamButton = (teamName) => page.locator(`[data-tid="Delete team ${teamName}"]`);
    }

    async gotoTeamsPage(): Promise<void> {
        await this.page.goto("/teams");
    }
}
