import React from "react";
import { Tooltip } from "@skbkontur/react-ui";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import Info from "@skbkontur/react-icons/Info";

export const NewVersionAvailableHint = () => {
    const { isNewFrontendVersionAvailable } = useAppSelector(UIState);

    return isNewFrontendVersionAvailable ? (
        <div style={{ position: "fixed", bottom: "30px", right: "30px" }}>
            <Tooltip render={() => "New version available, please reload the page"}>
                <Info size={30} />
            </Tooltip>
        </div>
    ) : null;
};
