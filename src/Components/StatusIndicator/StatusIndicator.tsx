import * as React from "react";
import { Status, getStatusColor } from "../../Domain/Status";
import classNames from "classnames/bind";

import styles from "./StatusIndicator.less";

const cn = classNames.bind(styles);

type Props = {
    disabled?: boolean;
    statuses: Array<Status>;
    size?: number;
};

function renderPath(statuses: Array<Status>): React.ReactElement {
    const [status1, status2, status3, status4] = statuses;

    switch (statuses.length) {
        case 1:
            if (status1 === Status.EXCEPTION) {
                return (
                    <circle
                        cx="0"
                        cy="0"
                        r="1"
                        fill={getStatusColor(status1)}
                        className={cn("blink")}
                    />
                );
            }

            return <circle cx="0" cy="0" r="1" fill={getStatusColor(status1)} />;
        case 2:
            return (
                <g>
                    <path
                        d="M 1 0 A 1 1 0 0 1 -1 1.2246467991473532e-16 L 0 0"
                        fill={getStatusColor(status1)}
                    />
                    <path
                        d="M -1 1.2246467991473532e-16 A 1 1 0 0 1 1 -2.4492935982947064e-16 L 0 0"
                        fill={getStatusColor(status2)}
                    />
                </g>
            );
        case 3:
            return (
                <g>
                    <path
                        d="M 1 0 A 1 1 0 0 1 -0.48175367410171543 0.8763066800438635 L 0 0"
                        fill={getStatusColor(status1)}
                    />
                    <path
                        d="M -0.48175367410171543 0.8763066800438635 A 1 1 0 0 1 -0.48175367410171527 -0.8763066800438636 L 0 0"
                        fill={getStatusColor(status2)}
                    />
                    <path
                        d="M -0.48175367410171527 -0.8763066800438636 A 1 1 0 0 1 1 -2.4492935982947064e-16 L 0 0"
                        fill={getStatusColor(status3)}
                    />
                </g>
            );
        case 4:
            return (
                <g>
                    <path d="M0 0-0.7 0.7A1 1 0 0 1-0.7-0.7Z" fill={getStatusColor(status1)} />
                    <path d="M0 0-0.7-0.7A1 1 0 0 1 0.7-0.7Z" fill={getStatusColor(status2)} />
                    <path d="M0 0 0.7-0.7A1 1 0 0 1 0.7 0.7Z" fill={getStatusColor(status3)} />
                    <path d="M0 0 0.7 0.7A1 1 0 0 1-0.7 0.7Z" fill={getStatusColor(status4)} />
                </g>
            );
        default:
            return <g />;
    }
}

export default function StatusIndicator(props: Props): React.ReactElement {
    const { statuses, disabled, size = 20 } = props;
    return (
        <svg viewBox="-1 -1 2 2" width={size} height={size} className={cn("svg", { disabled })}>
            {renderPath(statuses)}
        </svg>
    );
}
