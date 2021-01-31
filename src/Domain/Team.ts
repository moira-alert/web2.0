import { User } from "./User";

export interface TeamOverview {
    id: string;
    name: string;
}

export interface Team {
    id: string;
    name: string;
    description?: string;
    users: User[];
}
