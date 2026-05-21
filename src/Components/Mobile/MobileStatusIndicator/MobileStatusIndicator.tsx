import type { ReactElement } from "react";
import { Status } from "../../../Domain/Status";
import StatusIndicator from "../../StatusIndicator/StatusIndicator";

import styles from "./MobileStatusIndicator.module.less";

type Props = {
    statuses: Status[];
    size: number;
};

export default function MobileStatusIndicator(props: Props): ReactElement {
    const { statuses, size } = props;

    return (
        <div className={styles.indicatorContainer}>
            <StatusIndicator size={size} statuses={statuses} />
        </div>
    );
}
