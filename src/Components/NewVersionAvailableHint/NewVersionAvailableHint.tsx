import { Tooltip } from "@skbkontur/react-ui";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { IconInfoSquareRegular32 } from "@skbkontur/icons/IconInfoSquareRegular32";

export const NewVersionAvailableHint = () => {
    const { isNewFrontendVersionAvailable } = useAppSelector(UIState);

    return isNewFrontendVersionAvailable ? (
        <div style={{ position: "fixed", bottom: "30px", right: "30px" }}>
            <Tooltip render={() => "New version available, please reload the page"}>
                <IconInfoSquareRegular32 />
            </Tooltip>
        </div>
    ) : null;
};
