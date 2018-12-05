// @flow
import * as React from "react";
import moment from "moment";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Schedule } from "../../Domain/Schedule";
import type { Maintenance } from "../../Domain/Maintenance";
import { Maintenances, getMaintenanceCaption } from "../../Domain/Maintenance";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import Link from "retail-ui/components/Link";
import Icon from "retail-ui/components/Icon";
import Dropdown from "retail-ui/components/Dropdown";
import MenuItem from "retail-ui/components/MenuItem";
import TagGroup from "../TagGroup/TagGroup";
import cn from "./TriggerInfo.less";

type Props = {|
    data: Trigger,
    triggerState: TriggerState,
    supportEmail: string,
    onThrottlingRemove: (triggerId: string) => void,
    onSetMaintenance: (maintenance: Maintenance) => void,
|};

function checkMaintenance(maintenance: ?number): React.Node {
    const delta = (maintenance || 0) - moment.utc().unix();
    return <span>{delta <= 0 ? "Maintenance" : moment.duration(delta * 1000).humanize()}</span>;
}

function ScheduleView(props: { data: Schedule }): React.Node {
    const { days, startOffset, endOffset } = props.data;
    const enabledDays = days.filter(({ enabled }) => enabled);
    const viewDays = days.length === enabledDays.length ? "Everyday" : enabledDays.map(({ name }) => name).join(", ");
    const viewTime =
        moment("1900-01-01 00:00:00")
            .add(startOffset, "minutes")
            .format("HH:mm") +
        "–" +
        moment("1900-01-01 00:00:00")
            .add(endOffset, "minutes")
            .format("HH:mm");
    return (
        <div>
            {viewDays} {viewTime}
        </div>
    );
}

export default function TriggerInfo({
    data,
    triggerState,
    supportEmail,
    onThrottlingRemove,
    onSetMaintenance,
}: Props): React.Node {
    const {
        id,
        name,
        targets,
        desc,
        expression,
        error_value: errorValue,
        warn_value: warnValue,
        ttl_state: ttlState,
        ttl,
        sched,
        tags,
        throttling,
        is_remote: isRemote,
    } = data;
    const { state, msg: exceptionMessage, maintenance } = triggerState;

    const hasExpression = expression != null && expression !== "";
    const hasMultipleTargets = targets.length > 1;

    return (
        <section>
            <header className={cn("header")}>
                <h1 className={cn("title")}>{name != null && name !== "" ? name : "[No name]"}</h1>
                <div className={cn("controls")}>
                    {throttling !== 0 && (
                        <Link use="danger" icon="Clear" onClick={() => onThrottlingRemove(id)}>
                            Disable throttling
                        </Link>
                    )}
                    <RouterLink to={getPageLink("triggerEdit", id)} icon="Edit">
                        Edit
                    </RouterLink>
                    <RouterLink to={getPageLink("triggerDuplicate", id)} icon="DocumentCopy">
                        Duplicate
                    </RouterLink>
                    <Dropdown use="link" caption={checkMaintenance(maintenance)}>
                        {Object.keys(Maintenances).map(key => (
                            <MenuItem key={key} onClick={() => onSetMaintenance(key)}>
                                {getMaintenanceCaption(key)}
                            </MenuItem>
                        ))}
                    </Dropdown>
                </div>
            </header>
            <dl className={cn("list")}>
                <dt>Target {isRemote && "(remote)"}</dt>
                <dd>{targets.map((target, i) => <div key={i}>{target}</div>)}</dd>
                {desc && <dt>Description</dt>}
                {desc && <dd className={cn("description")}>{desc}</dd>}
                {!expression && <dt>Value</dt>}
                {!expression && (
                    <dd>
                        {warnValue != null && `Warning: ${warnValue}. `}
                        {errorValue != null && `Error: ${errorValue}. `}
                        Set {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}
                {expression && <dt>Expression</dt>}
                {expression && (
                    <dd>
                        {`${expression}. `}
                        Set {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}
                {sched && <dt>Schedule</dt>}
                {sched && (
                    <dd>
                        <ScheduleView data={sched} />
                    </dd>
                )}
                <dt>Tags</dt>
                <dd>
                    <TagGroup tags={tags} />
                </dd>
                {(state === "EXCEPTION" || state === "ERROR") && <dt />}
                {(state === "EXCEPTION" || state === "ERROR") && (
                    <dd className={cn("exception-explanation")}>
                        <div className={cn("line-1")}>
                            <Icon name="Error" color={"#D43517"} size={16} /> Trigger in {state} state.{" "}
                            {exceptionMessage}
                        </div>
                        <div className={cn("line-2")}>
                            Please verify trigger target
                            {hasMultipleTargets ? "s" : ""}
                            {hasExpression ? " and expression" : ""} on{" "}
                            <RouterLink to={`/trigger/${data.id}/edit`}>trigger edit page</RouterLink>.
                            {supportEmail != null && (
                                <span>
                                    {" "}
                                    Or <Link href={`mailto:${supportEmail}`}>contact</Link> with server administrator.
                                </span>
                            )}
                        </div>
                    </dd>
                )}
            </dl>
        </section>
    );
}
