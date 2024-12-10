import React, { FC, useState } from "react";
import { TeamCard } from "../../Components/Teams/TeamCard/TeamCard";
import { Grid } from "../../Components/Grid/Grid";
import { EmptyListText } from "../../Components/TriggerInfo/Components/EmptyListMessage/EmptyListText";
import { Team } from "../../Domain/Team";

export const TeamsList: FC<{ teams?: Team[] }> = ({ teams }) => {
    const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
    if (!teams?.length) return <EmptyListText text={"There are no teams"} />;
    return (
        <Grid gap="16px" columns="repeat(auto-fit, minmax(300px, 1fr))">
            {teams?.map((team) => (
                <TeamCard
                    key={team.id}
                    team={team}
                    isDeleting={deletingTeam?.id === team.id}
                    onOpenDelete={() => setDeletingTeam(team)}
                    onCloseDelete={() => setDeletingTeam(null)}
                />
            ))}
        </Grid>
    );
};
