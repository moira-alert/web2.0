// @flow
import * as React from "react";
import color from "color";
import type { Status } from "../../Domain/Status";
import { Statuses, getStatusColor } from "../../Domain/Status";
import cn from "./StatusIndicator.less";

type Props = {|
    disabled?: boolean,
    statuses: Array<Status>,
    size?: number,
|};

function getStatusColorEx(status: Status, disabled: ?boolean): string {
    const result = getStatusColor(status);
    if (disabled) {
        return color(result)
            .lighten(0.5)
            .rgb()
            .toString();
    }
    return result;
}

function renderPath(statuses: Array<Status>, disabled: ?boolean): React.Element<any> {
    const [status1, status2, status3] = statuses;

    switch (statuses.length) {
        case 1:
            if (status1 === Statuses.EXCEPTION) {
                return (
                    <circle cx="0" cy="0" r="1" fill={getStatusColorEx(status1, disabled)} className={cn("blink")} />
                );
            }
            return <circle cx="0" cy="0" r="1" fill={getStatusColorEx(status1, disabled)} />;
        case 2:
            return (
                <g>
                    <path
                        d="M 1 0 A 1 1 0 0 1 -1 1.2246467991473532e-16 L 0 0"
                        fill={getStatusColorEx(status1, disabled)}
                    />
                    <path
                        d="M -1 1.2246467991473532e-16 A 1 1 0 0 1 1 -2.4492935982947064e-16 L 0 0"
                        fill={getStatusColorEx(status2, disabled)}
                    />
                </g>
            );
        case 3:
            return (
                <g>
                    <path
                        d="M 1 0 A 1 1 0 0 1 -0.48175367410171543 0.8763066800438635 L 0 0"
                        fill={getStatusColorEx(status1, disabled)}
                    />
                    <path
                        d="M -0.48175367410171543 0.8763066800438635 A 1 1 0 0 1 -0.48175367410171527 -0.8763066800438636 L 0 0"
                        fill={getStatusColorEx(status2, disabled)}
                    />
                    <path
                        d="M -0.48175367410171527 -0.8763066800438636 A 1 1 0 0 1 1 -2.4492935982947064e-16 L 0 0"
                        fill={getStatusColorEx(status3, disabled)}
                    />
                </g>
            );
        default:
            return <g />;
    }
}

export default function StatusIndicator(props: Props): React.Node {
    const OPTIONS = {
        size: 20,
    };
    const { statuses, disabled, size } = props;

    return (
        <svg viewBox="-1 -1 2 2" width={size || OPTIONS.size} height={size || OPTIONS.size} className={cn("svg")}>
            {renderPath(statuses, disabled)}
        </svg>
    );
}
