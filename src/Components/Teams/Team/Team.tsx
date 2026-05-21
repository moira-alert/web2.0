import { ReactElement } from "react";
import { Button } from "@skbkontur/react-ui";
import { IconToolPencilLineRegular16 } from "@skbkontur/icons/IconToolPencilLineRegular16";
import { Team } from "../../../Domain/Team";
import { TeamEditor } from "../TeamEditor/TeamEditor";
import { MarkdownViewer } from "@skbkontur/markdown";
import { WysiwygWrapper } from "../../Markdown/WysiwygWrapper";
import { ConfirmFullTeamDeleteion } from "../ConfirmFullTeamDeletion/ConfirmFullTeamDeletion";
import { useModal } from "../../../hooks/useModal";
import classNames from "classnames/bind";

import styles from "./Team.module.less";

const cn = classNames.bind(styles);

interface ITeamProps {
    team: Team;
}

export function Team({ team }: ITeamProps): ReactElement {
    const { isModalOpen, openModal, closeModal } = useModal();

    return (
        <>
            <ConfirmFullTeamDeleteion team={team} />
            {team.description && (
                <WysiwygWrapper>
                    <MarkdownViewer source={team.description} />
                </WysiwygWrapper>
            )}
            <Button
                className={cn("editDescBtn")}
                icon={<IconToolPencilLineRegular16 />}
                use={"link"}
                onClick={openModal}
            >
                Edit Team
            </Button>
            {isModalOpen ? <TeamEditor team={team} onClose={closeModal} /> : null}
        </>
    );
}
