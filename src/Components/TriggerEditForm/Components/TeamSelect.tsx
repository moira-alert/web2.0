import { FC } from "react";
import { Select } from "@skbkontur/react-ui/components/Select";
import { IconXRegular16 } from "@skbkontur/icons/IconXRegular16";
import { DtoTeamModel } from "../../../Domain/__generated__/data-contracts";
import styles from "./TeamSelect.module.less";

interface TeamSelectProps {
    teams: DtoTeamModel[];
    teamId?: string | null;
    onValueChange: (teamId?: string) => void;
}

export const TeamSelect: FC<TeamSelectProps> = ({ teams, teamId, onValueChange }) => {
    const value = teams?.find((team) => team.id === teamId) ?? null;

    return (
        <>
            <Select
                value={value}
                items={teams}
                renderItem={(team) => team?.name}
                renderValue={(team) => team?.name}
                onValueChange={(team) => onValueChange(team?.id)}
            />
            {value && (
                <IconXRegular16
                    className={styles.icon}
                    onClick={() => {
                        onValueChange(undefined);
                    }}
                    size={24}
                />
            )}
        </>
    );
};
