import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { useGetTeamQuery } from "../../services/TeamsApi";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import RouterLink, { IRouterLinkProps } from "../RouterLink/RouterLink";
import { getPageLink } from "../../Domain/Global";

interface TeamNameTooltipProps extends Omit<IRouterLinkProps, "to"> {
    teamId: string;
    className?: string;
}

export const TeamNameTooltip: FC<TeamNameTooltipProps> = ({
    teamId,
    className,
    ...routerLinkProps
}) => {
    const [isOpened, setOpened] = useState(false);

    const { data, isLoading, isError, error } = useGetTeamQuery(
        { teamId, handleLoadingLocally: true, handleErrorLocally: true },
        { skip: !isOpened }
    );

    let tooltipContent: ReactNode = "Can't get team";

    if (isLoading) {
        tooltipContent = <Spinner caption={null} type="mini" />;
    } else if (isError) {
        tooltipContent = String(error);
    } else if (data?.name) {
        tooltipContent = data.name;
    }

    return (
        <Tooltip pos="top left" render={() => tooltipContent} onOpen={() => setOpened(true)}>
            <RouterLink
                className={className}
                {...routerLinkProps}
                to={getPageLink("teamSettings", teamId)}
            >
                {teamId}
            </RouterLink>
        </Tooltip>
    );
};
