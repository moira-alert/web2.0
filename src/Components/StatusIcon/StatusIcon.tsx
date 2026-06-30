import type { ReactElement } from "react";
import { Status } from "../../Domain/Status";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import classNames from "classnames/bind";

import styles from "./StatusIcon.module.less";

const cn = classNames.bind(styles);

type Props = {
    status: Status;
    disabled?: boolean;
};

export default function StatusIcon(props: Props): ReactElement {
    const { status, disabled } = props;
    const { isColorBlindThemeOn } = useAppSelector(UIState);

    return (
        <span className={cn("root")}>
            <StatusIndicator
                colorBlind={isColorBlindThemeOn}
                statuses={[status]}
                disabled={disabled}
                size={12}
            />
        </span>
    );
}
