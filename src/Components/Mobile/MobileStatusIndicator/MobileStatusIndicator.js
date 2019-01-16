// @flow
import * as React from "react";
import type { Status } from "../../../Domain/Status";
import StatusIndicator from "../../StatusIndicator/StatusIndicator";

type Props = {|
    statuses: Array<Status>,
    size?: number,
|};

export default function MobileStatusIndicator(props: Props): React.Node {
    const { statuses, size } = props;

    return <StatusIndicator size={size} statuses={statuses} />;
}
