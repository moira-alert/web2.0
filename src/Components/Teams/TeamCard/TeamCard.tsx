import React, { FC, useState } from "react";
import TrashIcon from "@skbkontur/react-icons/Trash";
import EditIcon from "@skbkontur/react-icons/Edit";
import { Button, Kebab } from "@skbkontur/react-ui";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { useFullyDeleteTeam } from "../../../hooks/useFullyDeleteTeam";
import WarningIcon from "@skbkontur/react-icons/Warning";
import { fullyDeleteTeamConfirmText } from "../../../helpers/teamOperationsConfirmMessages";
import ModalError from "../../../Components/ModalError/ModalError";
import { Users } from "../../../Components/Teams/Users";
import { useModal } from "../../../hooks/useModal";
import { TeamEditor } from "../../../Components/Teams/TeamEditor/TeamEditor";
import { getPageLink } from "../../../Domain/Global";
import { Markdown } from "../../../Components/Markdown/Markdown";
import { Team } from "../../../Domain/Team";
import { Flexbox } from "../../Flexbox/FlexBox";
import { useTheme } from "../../../Themes";
import { Link } from "@skbkontur/react-ui/components/Link";
import classNames from "classnames/bind";

import styles from "./TeamCard.less";

const cn = classNames.bind(styles);

interface ITeamCardProps {
    team: Team;
    isDeleting: boolean;
    onOpenDelete: () => void;
    onCloseDelete: () => void;
}

export const TeamCard: FC<ITeamCardProps> = ({ team, isDeleting, onOpenDelete, onCloseDelete }) => {
    const { name, description, id } = team;
    const [error, setError] = useState("");
    const { isModalOpen, openModal, closeModal } = useModal();
    const theme = useTheme();

    const handleConfirm = async () => {
        try {
            await handleFullyDeleteTeam();
            onCloseDelete();
        } catch (error) {
            setError(error);
        }
    };

    const {
        handleFullyDeleteTeam,
        isFetchingData,
        isDeletingContacts,
        isDeletingSubscriptions,
        isDeletingUsers,
        isDeletingTeam,
    } = useFullyDeleteTeam(id, !isDeleting);

    const confirmMessage = fullyDeleteTeamConfirmText(
        isFetchingData,
        isDeletingContacts,
        isDeletingSubscriptions,
        isDeletingUsers,
        isDeletingTeam,
        name
    );

    const isLoading =
        isFetchingData ||
        isDeletingContacts ||
        isDeletingSubscriptions ||
        isDeletingUsers ||
        isDeletingTeam;

    return (
        <>
            <div
                style={{
                    backgroundColor: theme.teamCardBackgroundColor,
                    borderColor: theme.inputBorderColor,
                }}
                className={cn("team-card")}
            >
                <Flexbox gap={5}>
                    <Kebab className={cn("team-card-kebab")} size="large">
                        <MenuItem icon={<EditIcon />} onClick={openModal}>
                            Edit
                        </MenuItem>
                        <MenuItem icon={<TrashIcon />} onClick={onOpenDelete}>
                            Delete
                        </MenuItem>
                    </Kebab>
                    {isDeleting ? (
                        <>
                            <Flexbox gap={8} align="center">
                                <WarningIcon size={40} />
                                {confirmMessage +
                                    " If you are not a member, add yourself before deleting."}
                                <ModalError padding={"10px 16px"} margin={0} message={error} />
                                <Flexbox direction="row" gap={8}>
                                    <Button
                                        loading={isLoading}
                                        onClick={handleConfirm}
                                        use={"primary"}
                                        width={100}
                                    >
                                        Confirm
                                    </Button>
                                    <Button disabled={isLoading} onClick={onCloseDelete}>
                                        Cancel
                                    </Button>
                                </Flexbox>
                            </Flexbox>
                        </>
                    ) : (
                        <>
                            <div className={cn("team-name")}>{name}</div>
                            <div className={cn("team-id")}>{`id: ${id}`}</div>
                            <div className={cn("team-description")}>
                                {description && <Markdown markdown={description} />}
                            </div>
                            <Flexbox justify="space-between" direction="row">
                                <div className={cn("team-users")}>
                                    <Users team={team} />
                                </div>
                                <Link href={getPageLink("teamSettings", team.id)}>
                                    Team settings
                                </Link>
                            </Flexbox>
                        </>
                    )}
                </Flexbox>
            </div>
            {isModalOpen && <TeamEditor team={team} onClose={closeModal} />}
        </>
    );
};
