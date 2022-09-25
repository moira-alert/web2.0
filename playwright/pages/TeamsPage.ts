import { Locator, Page } from "@playwright/test";

export class TeamsPage {
    readonly page: Page;
    readonly addTeamButton: Locator;
    readonly teamNameInput: Locator;
    readonly teamDescriptionInput: Locator;
    readonly saveTeamButton: Locator;
    readonly editTeamButton: Locator;
    readonly deleteTeamButton: Locator;
    readonly showUsersButton: Locator;
    readonly addUserButton: Locator;
    readonly deleteUserButton: (userName: string) => Locator;
    readonly userNameInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addTeamButton = page.locator("button", { hasText: "Add team" });
        this.teamNameInput = page.locator("[data-tid=team_name]");
        this.teamDescriptionInput = page.locator("[data-tid=team_description]");
        this.saveTeamButton = page.locator("[data-tid=team_modal] >> button", {
            hasText: /Add$|Save$/,
        });
        this.editTeamButton = page.locator("[data-tid=edit_team]");
        this.deleteTeamButton = page.locator("[data-tid=delete_team]");

        this.showUsersButton = page.locator("button", { hasText: "Show Users" });
        this.userNameInput = page.locator("[data-tid=user_name]");
        this.addUserButton = page.locator("[data-tid=user_modal] >> button", {
            hasText: "Add User",
        });
        this.deleteUserButton = (userName) => page.locator(`[data-tid="delete_user ${userName}"]`);
    }

    async goto(): Promise<void> {
        await this.page.goto("/teams");
    }
}
