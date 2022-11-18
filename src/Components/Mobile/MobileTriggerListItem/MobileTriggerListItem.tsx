import * as React from "react";
import { getUnixTime } from "date-fns";
import { Link as ReactRouterLink } from "react-router-dom";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import UserSettingsIcon from "@skbkontur/react-icons/UserSettings";
import { Trigger } from "../../../Domain/Trigger";
import { StatusesList } from "../../../Domain/Status";
import { MetricItemList } from "../../../Domain/Metric";
import { getPageLink } from "../../../Domain/Global";
import { Status } from "../../../Domain/Status";
import { getUTCDate } from "../../../helpers/DateUtil";
import getStatusColor from "../Styles/StatusColor";
import MobileStatusIndicator from "../MobileStatusIndicator/MobileStatusIndicator";
import cn from "./MobileTriggerListItem.less";
import _ from "lodash";

type Props = {
    data: Trigger;
};

type State = {
    metrics: MetricItemList;
};

export default class TriggerListItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const metrics = props.data.last_check?.metrics;
        this.state = {
            metrics: metrics || {},
        };
    }

    render(): React.ReactElement {
        const { data } = this.props;
        const { id, name, tags, throttling, last_check: lastCheck } = data;
        const maintenance = lastCheck?.maintenance ?? 0;
        const delta = maintenance - getUnixTime(getUTCDate());

        return (
            <ReactRouterLink className={cn("root")} to={getPageLink("trigger", id)}>
                <div className={cn("status")}>
                    {this.renderStatus()}
                    {throttling !== 0 && <FlagSolidIcon className={cn("throttling-flag")} />}
                </div>
                <div className={cn("info")}>
                    <div className={cn("name")}>
                        {name != null && name !== "" ? name : "[No name]"}
                        {delta > 0 && <UserSettingsIcon className={cn("maintenance")} />}
                    </div>
                    <div className={cn("tags")}>{tags.map((x) => `#${x}`).join(", ")}</div>
                    <div className={cn("metrics")}>Metrics: {this.renderCounters()}</div>
                </div>
            </ReactRouterLink>
        );
    }

    renderCounters(): React.ReactElement {
        const counters = StatusesList.map((status) => ({
            status,
            count: Object.keys(this.filterMetricsByStatus(status)).length,
        }))
            .filter(({ count }) => count !== 0)
            .map(({ status, count }) => (
                <span key={status}>
                    <span className={cn("caption")}>{status}: </span>
                    <span style={{ color: getStatusColor(status) }} className={cn("value")}>
                        {count}
                    </span>
                </span>
            ));
        return (
            <span className={cn("metrics-list")}>
                {counters.length !== 0 ? counters : <span className={cn("NA")}>N/A</span>}
            </span>
        );
    }

    renderStatus(): React.ReactNode {
        const { data } = this.props;
        const { state: triggerStatus } = data.last_check || {};
        const metricStatuses = StatusesList.filter(
            (x) => Object.keys(this.filterMetricsByStatus(x)).length !== 0
        );
        const notOkStatuses = metricStatuses.filter((x) => x !== Status.OK);
        let statuses: Status[];
        if (triggerStatus && (triggerStatus !== Status.OK || metricStatuses.length === 0)) {
            statuses = [triggerStatus];
        } else if (notOkStatuses.length !== 0) {
            statuses = notOkStatuses;
        } else {
            statuses = [Status.OK];
        }
        return <MobileStatusIndicator size={40} statuses={statuses} />;
    }

    filterMetricsByStatus(status: Status): MetricItemList {
        const { metrics } = this.state;
        return _.pickBy(metrics, (metric) => metric.state === status);
    }
}
