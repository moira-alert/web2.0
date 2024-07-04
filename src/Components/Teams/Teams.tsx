import React, { ReactElement } from "react";
import { Button } from "@skbkontur/react-ui";
import { Grid } from "../Grid/Grid";
import { TeamEditor } from "./TeamEditor/TeamEditor";
import { useGetUserTeamsQuery } from "../../services/TeamsApi";
import { useModal } from "../../hooks/useModal";
import { TeamWithUsers } from "./TeamWithUsers";

export function Teams(): ReactElement {
    const { isModalOpen, openModal, closeModal } = useModal();
    const { data: teams } = useGetUserTeamsQuery();

    return (
        <>
            {teams?.map((team) => {
                return (
                    <div key={team.id}>
                        <TeamWithUsers team={team} />
                    </div>
                );
            })}
            <Grid columns="100px" margin="24px 0">
                <Button onClick={openModal}>Add team</Button>
            </Grid>
            {isModalOpen ? <TeamEditor onClose={closeModal} /> : null}
        </>
    );
}
