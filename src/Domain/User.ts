export interface IUser {
    login: string;
    role?: EUserRoles;
    auth_enabled?: boolean;
}

export enum EUserRoles {
    Admin = "admin",
    User = "user",
}
