export interface User {
    login: string;
    role?: UserRoles;
    auth_enabled?: boolean;
}

export enum UserRoles {
    Admin = "admin",
    User = "user",
}
