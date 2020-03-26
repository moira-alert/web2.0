// @flow
import * as React from "react";
import type { Event } from "../../Domain/Event";
import cn from "./EventList.less";
import MetricEvents from "../MetricEvents/MetricEvents";

type Props = {|
    items: {
        [key: string]: Array<Array<Event>, Number>,
    },
|};

export default function EventList(props: Props): React.Node {
    const { items } = props;
    return (
        <section>
            <div className={cn("row", "header")}>
                <div className={cn("name")}>Metric</div>
                <div className={cn("state-change")}>State change</div>
                <div className={cn("count")}>Events count</div>
                <div className={cn("date")}>Event time</div>
                <div className={cn("dropdown")} />
            </div>
            {Object.keys(items).map(key => (
                <div key={key} className={cn("group")}>
                    <MetricEvents metricName={key} events={items[key][0]} count={items[key][1]} />
                </div>
            ))}
        </section>
    );
}
