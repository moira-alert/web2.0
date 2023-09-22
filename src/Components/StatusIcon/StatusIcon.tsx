import * as React from "react";
import { Status } from "../../Domain/Status";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import classNames from "classnames/bind";

import styles from "./StatusIcon.less";

const cn = classNames.bind(styles);

type Props = {
    status: Status;
    disabled?: boolean;
};

export default function StatusIcon(props: Props): React.ReactElement {
    const { status, disabled } = props;
    return (
        <span className={cn("root")}>
            <StatusIndicator statuses={[status]} disabled={disabled} size={12} />
        </span>
    );
}
