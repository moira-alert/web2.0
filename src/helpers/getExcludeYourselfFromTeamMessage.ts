export const getExcludeYourselfFromTeamMessage = (
    userName: string,
    teamName: string,
    currentUserLogin?: string
) => {
    if (userName === currentUserLogin) {
        return `You are trying to exclude yourself from the "${teamName}". If you do this, you will no longer be able to see this team. Are you sure you want to exclude yourself?`;
    }
    return `Exclude "${userName}" from "${teamName}"?`;
};
