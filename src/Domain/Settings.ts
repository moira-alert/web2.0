import { DtoUserSettings, DtoTeamSettings } from "./__generated__/data-contracts";

export type UserSettings = DtoUserSettings;
export type TeamSettings = DtoTeamSettings;

export type Settings = UserSettings | TeamSettings;
