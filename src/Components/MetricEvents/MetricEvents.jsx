// @flow
import * as React from "react";
import moment from "moment";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import ArrowChecvronDownIcon from "@skbkontur/react-icons/ArrowChevronDown";
import ArrowChecvronUpIcon from "@skbkontur/react-icons/ArrowChevronUp";
import Button from "retail-ui/components/Button";
import roundValue from "../../helpers/roundValue";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import cn from "./MetricEvents.less";
import type { Event } from "../../Domain/Event";

type Props = {|
    metricName: string,
    events: Array<Event>,
|};

type State = {
    expand: Boolean,
};

class MetricEvents extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            expand: false,
        };
    }

    render(): React.Node {
        const { events, metricName } = this.props;
        const { expand } = this.state;

        return events.map(({ old_state: oldState, state, timestamp, value }, i) => {
            const oldValue = events[i + 1] && events[i + 1].value;
            let arrowIcon;
            if (!expand) {
                arrowIcon = <ArrowChecvronDownIcon />;
            } else {
                arrowIcon = <ArrowChecvronUpIcon />;
            }
            return (
                (i === 0 || expand) && (
                    <div key={`${metricName}-${timestamp}`} className={cn("row")}>
                        <div className={cn("name")}>{i === 0 && metricName}</div>
                        <>
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
                                <div className={cn("curr-value")}>{roundValue(value, false)}</div>
                            </div>
                            <div className={cn("date")}>
                                {moment.unix(timestamp).format("MMMM D, HH:mm:ss")}
                            </div>
                        </>
                        <div className={cn("dropdown")}>
                            {i === 0 && events.length > 1 && (
                                <Button
                                    use="link"
                                    onClick={() => {
                                        this.toggleExpand();
                                    }}
                                >
                                    {arrowIcon}
                                </Button>
                            )}
                        </div>
                    </div>
                )
            );
        });
    }

    toggleExpand = async () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };
}

export { MetricEvents as default };
