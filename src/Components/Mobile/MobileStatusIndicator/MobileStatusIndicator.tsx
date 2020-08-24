import * as React from "react";
import { Status } from "../../../Domain/Status";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import StatusIndicator from "../../StatusIndicator/StatusIndicator";

type Props = {
    statuses: Array<Status>;
    size: number;
};

export default function MobileStatusIndicator(props: Props): React.ReactElement {
    const { statuses, size } = props;

    return <StatusIndicator size={size} statuses={statuses} />;
}
