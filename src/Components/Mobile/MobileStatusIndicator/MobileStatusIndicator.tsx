import * as React from "react";
import { Status } from "../../../Domain/Status";
import StatusIndicator from "../../StatusIndicator/StatusIndicator";

type Props = {
    statuses: Status[];
    size: number;
};

export default function MobileStatusIndicator(props: Props): React.ReactElement {
    const { statuses, size } = props;

    return <StatusIndicator size={size} statuses={statuses} />;
}
