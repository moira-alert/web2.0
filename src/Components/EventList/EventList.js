// @flow
import * as React from "react";
import moment from "moment";
import type { Event } from "../../Domain/Event";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import roundValue from "../../Helpers/roundValue";
import cn from "./EventList.less";

type Props = {|
    items: {
        [key: string]: Array<Event>,
    },
|};

export default function EventList(props: Props): React.Node {
    const { items } = props;
    return (
        <section>
            <div className={cn("row", "header")}>
                <div className={cn("name")}>Metric</div>
                <div className={cn("state-change")}>State change</div>
                <div className={cn("date")}>Event time</div>
            </div>
            {Object.keys(items).map(key => {
                return (
                    <div key={key} className={cn("group")}>
                        {items[key].map(({ old_state: oldState, state, timestamp, value }, i) => {
                            const oldValue = items[key][i + 1] && items[key][i + 1].value;
                            return (
                                <div key={i} className={cn("row")}>
                                    <div className={cn("name")}>{i === 0 && key}</div>
                                    <div className={cn("state-change")}>
                                        <div className={cn("prev-value")}>
                                            {roundValue(oldValue, false)}
                                        </div>
                                        <div className={cn("prev-state")}>
                                            <StatusIndicator statuses={[oldState]} size={14} />
                                        </div>
                                        <div className={cn("arrow")}>
                                            <ArrowBoldRightIcon />
                                        </div>
                                        <div className={cn("curr-state")}>
                                            <StatusIndicator statuses={[state]} size={14} />
                                        </div>
                                        <div className={cn("curr-value")}>
                                            {roundValue(value, false)}
                                        </div>
                                    </div>
                                    <div className={cn("date")}>
                                        {moment.unix(timestamp).format("MMMM D, HH:mm:ss")}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </section>
    );
}
