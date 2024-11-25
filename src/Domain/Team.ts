export interface Team {
    id: string;
    name: string;
    description?: string;
}

export interface ITeamList {
    list: Team[];
    page: number;
    size: number;
    total: number;
}
