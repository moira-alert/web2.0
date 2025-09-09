import { OverrideField } from "../helpers/OverrideField";
import { DtoUser } from "./__generated__/data-contracts";

export type IUser = OverrideField<DtoUser, "role", EUserRoles>;

export enum EUserRoles {
    Admin = "admin",
    User = "user",
}
