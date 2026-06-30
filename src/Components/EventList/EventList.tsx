import type { ReactElement } from "react";
import { format, fromUnixTime } from "date-fns";
import { IconArrowARightRegular16 } from "@skbkontur/icons/IconArrowARightRegular16";
import { Event } from "../../Domain/Event";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import MetricValues from "../MetricValues/MetricValues";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import classNames from "classnames/bind";

import styles from "./EventList.module.less";

const cn = classNames.bind(styles);

type Props = {
    items: {
        [key: string]: Array<Event>;
    };
};

export default function EventList(props: Props): ReactElement {
    const { items } = props;
    const { isColorBlindThemeOn } = useAppSelector(UIState);

    return (
        <section>
            <div className={cn("row", "header")}>
                <div className={cn("name")}>Metric</div>
                <div className={cn("state-change")}>State change</div>
                <div className={cn("date")}>Event time</div>
            </div>
            {Object.keys(items).map((key) => (
                <div key={key} className={cn("group")}>
                    {items[key].map(({ old_state: oldState, state, timestamp, values }, i) => {
                        const oldValues = items[key][i + 1] && items[key][i + 1].values;
                        return (
                            <div key={`${key}-${timestamp}`} className={cn("row")}>
                                <div className={cn("name")}>{i === 0 && key}</div>
                                <div className={cn("state-change")}>
                                    <div className={cn("prev-value")}>
                                        <MetricValues values={oldValues} placeholder={false} />
                                    </div>
                                    <div className={cn("prev-state")}>
                                        <StatusIndicator
                                            colorBlind={isColorBlindThemeOn}
                                            statuses={[oldState]}
                                            size={14}
                                        />
                                    </div>
                                    <div className={cn("arrow")}>
                                        <IconArrowARightRegular16 />
                                    </div>
                                    <div className={cn("curr-state")}>
                                        <StatusIndicator
                                            colorBlind={isColorBlindThemeOn}
                                            statuses={[state]}
                                            size={14}
                                        />
                                    </div>
                                    <div className={cn("curr-value")}>
                                        <MetricValues values={values} placeholder={false} />
                                    </div>
                                </div>
                                <div className={cn("date")}>
                                    {format(fromUnixTime(timestamp), "MMM d, y, HH:mm:ss")}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </section>
    );
}
