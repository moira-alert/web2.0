export const getExcludeYourselfFromTeamMessage = (
    userName: string,
    teamName: string,
    currentUserLogin?: string
) => {
    if (userName === currentUserLogin) {
        return `You are trying to exclude yourself from the "${teamName}". If you do this, you will no longer be able to access this team. Are you sure you want to exclude yourself?`;
    }
    return `Exclude "${userName}" from "${teamName}"?`;
};

export const fullyDeleteTeamConfirmText = (
    isFetchingData: boolean,
    isDeletingContacts: boolean,
    isDeletingSubscriptions: boolean,
    isDeletingUsers: boolean,
    isDeletingTeam: boolean,
    teamName: string
) => {
    switch (true) {
        case isFetchingData:
            return "Fetching data...";
        case isDeletingContacts:
            return "Deleting contacts...";
        case isDeletingSubscriptions:
            return "Deleting subscriptions...";
        case isDeletingUsers:
            return "Deleting users...";
        case isDeletingTeam:
            return "Deleting team...";
        default:
            return `Do you really want to remove "${teamName}" team? This action will also delete all team users, contacts and subscriptions.`;
    }
};
