// @flow
import * as React from "react";
import moment from "moment";
import Remarkable from "remarkable";
import { sanitize } from "dompurify";
import Link from "retail-ui/components/Link";
import Button from "retail-ui/components/Button";
import ErrorIcon from "@skbkontur/react-icons/Error";
import ClockIcon from "@skbkontur/react-icons/Clock";
import EditIcon from "@skbkontur/react-icons/Edit";
import ClearIcon from "@skbkontur/react-icons/Clear";
import DocumentCopyIcon from "@skbkontur/react-icons/DocumentCopy";
import Dropdown from "retail-ui/components/Dropdown";
import MenuItem from "retail-ui/components/MenuItem";
import UserIcon from "@skbkontur/react-icons/User";
import Tooltip from "retail-ui/components/Tooltip";
import TagGroup from "../TagGroup/TagGroup";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Schedule } from "../../Domain/Schedule";
import type { Maintenance } from "../../Domain/Maintenance";
import { Maintenances, getMaintenanceCaption } from "../../Domain/Maintenance";
import { getPageLink } from "../../Domain/Global";
import { purifyConfig } from "../../Domain/DOMPurify";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./TriggerInfo.less";

const md = new Remarkable({ breaks: true });

type Props = {|
    data: Trigger,
    triggerState: TriggerState,
    supportEmail: string,
    onThrottlingRemove: (triggerId: string) => void,
    onSetMaintenance: (maintenance: Maintenance) => void,
|};

function maintenanceDelta(maintenance: ?number): React.Node {
    return (maintenance || 0) - moment.utc().unix();
}

function maintenanceCaption(delta: number): React.Node {
    return (
        <span>
            <ClockIcon />
            &nbsp;
            {delta <= 0 ? "Maintenance" : moment.duration(delta * 1000).humanize()}
        </span>
    );
}

function ScheduleView(props: { data: Schedule }): React.Node {
    const { data } = props;
    const { days, startOffset, endOffset, tzOffset } = data;

    const startTime = moment()
        .utc()
        .startOf("day")
        .add(startOffset, "minutes")
        .format("HH:mm");
    const endTime = moment()
        .utc()
        .startOf("day")
        .add(endOffset, "minutes")
        .format("HH:mm");
    const timeZone = moment()
        .utc()
        .startOf("day")
        .add(Math.abs(tzOffset), "minutes")
        .format("HH:mm");
    const timeZoneSign = tzOffset < 0 ? "−" : "+";
    const enabledDays = days.filter(({ enabled }) => enabled);

    return (
        <React.Fragment>
            {days.length === enabledDays.length
                ? "Everyday"
                : enabledDays.map(({ name }) => name).join(", ")}{" "}
            {startTime}—{endTime} (GMT {timeZoneSign}
            {timeZone})
        </React.Fragment>
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
        desc,
        targets,
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
    const {
        state,
        msg: exceptionMessage,
        maintenance,
        maintenance_info: maintenanceInfo,
    } = triggerState;

    const hasExpression = expression != null && expression !== "";
    const hasMultipleTargets = targets.length > 1;
    const delta = maintenanceDelta(maintenance);

    return (
        <section>
            <header className={cn("header")}>
                <h1 className={cn("title")}>{name != null && name !== "" ? name : "[No name]"}</h1>
                <div className={cn("controls")}>
                    {throttling !== 0 && (
                        <span className={cn("control")}>
                            <Button
                                use="link"
                                icon={<ClearIcon />}
                                onClick={() => onThrottlingRemove(id)}
                            >
                                Disable throttling
                            </Button>
                        </span>
                    )}
                    <span className={cn("control")}>
                        <RouterLink to={getPageLink("triggerEdit", id)} icon={<EditIcon />}>
                            Edit
                        </RouterLink>
                    </span>
                    <span className={cn("control")}>
                        <RouterLink
                            to={getPageLink("triggerDuplicate", id)}
                            icon={<DocumentCopyIcon />}
                        >
                            Duplicate
                        </RouterLink>
                    </span>
                    <span className={cn("control")}>
                        <Dropdown use="link" caption={maintenanceCaption(delta)}>
                            {Object.keys(Maintenances).map(key => (
                                <MenuItem key={key} onClick={() => onSetMaintenance(key)}>
                                    {getMaintenanceCaption(key)}
                                </MenuItem>
                            ))}
                        </Dropdown>
                    </span>
                    <span>
                        {delta > 0 &&
                            maintenanceInfo &&
                            maintenanceInfo.setup_user &&
                            maintenanceInfo.setup_time && (
                                <Tooltip
                                    render={() => (
                                        <div>
                                            Maintenance was set
                                            <br />
                                            by {maintenanceInfo.setup_user}
                                            <br />
                                            at{" "}
                                            {moment
                                                .unix(maintenanceInfo.setup_time)
                                                .format("MMMM D, HH:mm:ss")}
                                        </div>
                                    )}
                                >
                                    <UserIcon className={cn("maintenance-info")} />
                                </Tooltip>
                            )}
                    </span>
                </div>
            </header>
            <dl className={cn("list")}>
                <dt>Target {isRemote && "(remote)"}</dt>
                <dd>
                    {targets.map(target => (
                        <div key={target}>{target}</div>
                    ))}
                </dd>
                {desc && <dt>Description</dt>}
                {desc && (
                    <dd
                        className={cn("description", "wysiwyg")}
                        dangerouslySetInnerHTML={{
                            __html: sanitize(md.render(desc), purifyConfig),
                        }}
                    />
                )}
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
                            <ErrorIcon color="#D43517" /> Trigger in {state} state.{" "}
                            {exceptionMessage}
                        </div>
                        <div className={cn("line-2")}>
                            Please verify trigger target
                            {hasMultipleTargets ? "s" : ""}
                            {hasExpression ? " and expression" : ""} on{" "}
                            <RouterLink to={`/trigger/${data.id}/edit`}>
                                trigger edit page
                            </RouterLink>
                            .
                            {supportEmail != null && (
                                <span>
                                    {" "}
                                    Or <Link href={`mailto:${supportEmail}`}>contact</Link> with
                                    server administrator.
                                </span>
                            )}
                        </div>
                    </dd>
                )}
            </dl>
        </section>
    );
}
