// @flow
import * as React from "react";
import type { Status } from "../../Domain/Status";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import cn from "./StatusIcon.less";

type Props = {
    status: Status,
    disabled?: boolean,
};

export default function StatusIcon(props: Props): React.Node {
    const { status, disabled } = props;
    return (
        <span className={cn("root")}>
            <StatusIndicator statuses={[status]} disabled={disabled} size={12} />
        </span>
    );
}
