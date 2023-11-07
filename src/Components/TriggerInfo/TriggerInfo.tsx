import * as React from "react";
import { History } from "history";
import { format, addMinutes, startOfDay, fromUnixTime, getUnixTime } from "date-fns";
import { Remarkable } from "remarkable";
import { sanitize } from "dompurify";
import queryString from "query-string";
import { Link } from "@skbkontur/react-ui/components/Link";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import ErrorIcon from "@skbkontur/react-icons/Error";
import ClockIcon from "@skbkontur/react-icons/Clock";
import EditIcon from "@skbkontur/react-icons/Edit";
import ClearIcon from "@skbkontur/react-icons/Clear";
import DocumentCopyIcon from "@skbkontur/react-icons/DocumentCopy";
import UserIcon from "@skbkontur/react-icons/User";
import TagGroup from "../TagGroup/TagGroup";
import { Trigger, TriggerSource, TriggerState } from "../../Domain/Trigger";
import { Schedule } from "../../Domain/Schedule";
import { getPageLink } from "../../Domain/Global";
import { purifyConfig } from "../../Domain/DOMPurify";
import { getUTCDate, humanizeDuration } from "../../helpers/DateUtil";
import { omitTrigger } from "../../helpers/omitTypes";
import RouterLink from "../RouterLink/RouterLink";
import FileExport from "../FileExport/FileExport";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import { CodeEditor } from "../HighlightInput/CodeEditor";
import { Gapped, Hint } from "@skbkontur/react-ui";
import { CopyButton } from "../TriggerEditForm/Components/CopyButton";

import classNames from "classnames/bind";

import styles from "./TriggerInfo.less";

const cn = classNames.bind(styles);

const md = new Remarkable({ breaks: true });

interface IProps {
    data: Trigger;
    triggerState: TriggerState;
    supportEmail?: string;
    onThrottlingRemove: (triggerId: string) => void;
    onSetMaintenance: (maintenance: number) => void;
    history: History;
}

function maintenanceDelta(maintenance?: number | null): number {
    return (maintenance || 0) - getUnixTime(getUTCDate());
}

function maintenanceCaption(delta: number): React.ReactNode {
    return (
        <span>
            <ClockIcon />
            &nbsp;
            {delta <= 0 ? "Maintenance" : humanizeDuration(delta)}
        </span>
    );
}

function ScheduleView(props: { data: Schedule }): React.ReactElement {
    const { data } = props;
    const { days, startOffset, endOffset, tzOffset } = data;

    const startTime = format(addMinutes(startOfDay(getUTCDate()), startOffset), "HH:mm");

    const endTime = format(addMinutes(startOfDay(getUTCDate()), endOffset), "HH:mm");

    const timeZone = format(addMinutes(startOfDay(getUTCDate()), Math.abs(tzOffset)), "HH:mm");

    const timeZoneSign = tzOffset < 0 ? "+" : "−";
    const enabledDays = days.filter(({ enabled }) => enabled);

    return (
        <>
            {days.length === enabledDays.length
                ? "Everyday"
                : enabledDays.map(({ name }) => name).join(", ")}{" "}
            {startTime}—{endTime} (GMT {timeZoneSign}
            {timeZone})
        </>
    );
}

function triggerSourceDescription(source: TriggerSource): string | undefined {
    switch (source) {
        case TriggerSource.GRAPHITE_REMOTE:
            return "(remote)";
        case TriggerSource.PROMETHEUS_REMOTE:
            return "(prometheus)";
        case TriggerSource.GRAPHITE_LOCAL:
            return undefined;
    }
}

export default function TriggerInfo({
    data,
    triggerState,
    supportEmail,
    onThrottlingRemove,
    onSetMaintenance,
    history,
}: IProps): React.ReactElement {
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
        trigger_source: triggerSource,
    } = data;
    const { state, msg: exceptionMessage, maintenance, maintenanceInfo } = triggerState;

    const hasExpression = expression != null && expression !== "";
    const hasMultipleTargets = targets.length > 1;
    const delta = maintenanceDelta(maintenance);

    return (
        <section>
            <header className={cn("header")}>
                <h1 className={cn("title")} data-tid="Name">
                    {name != null && name !== "" ? name : "[No name]"}
                </h1>
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
                    <span className={cn("control")} data-tid="Edit">
                        <RouterLink to={getPageLink("triggerEdit", id)} icon={<EditIcon />}>
                            Edit
                        </RouterLink>
                    </span>
                    <span className={cn("control")}>
                        <FileExport data={omitTrigger(data)} title={`trigger ${name || id}`} />
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
                        <MaintenanceSelect
                            maintenance={maintenance}
                            caption={maintenanceCaption(delta)}
                            onSetMaintenance={onSetMaintenance}
                        />
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
                                            {format(
                                                fromUnixTime(maintenanceInfo.setup_time),
                                                "MMMM d, HH:mm:ss"
                                            )}
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
                <dt>
                    Target
                    <br />
                    {triggerSourceDescription(triggerSource)}
                </dt>
                <dd className={cn("codeEditor")}>
                    <Gapped vertical gap={10}>
                        {targets.map((target, i) => (
                            <>
                                <div className={cn("copyButtonWrapper")}>
                                    <Hint text="Copy without formatting">
                                        <CopyButton className={cn("copyButton")} value={target} />
                                    </Hint>
                                </div>
                                <CodeEditor
                                    triggerSource={triggerSource}
                                    disabled
                                    key={i}
                                    value={target}
                                />
                            </>
                        ))}
                    </Gapped>
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
                    <TagGroup
                        onClick={(tag) => {
                            history?.push(
                                `/?${queryString.stringify(
                                    { tags: [tag] },
                                    {
                                        arrayFormat: "index",
                                        encode: true,
                                    }
                                )}`
                            );
                        }}
                        tags={tags}
                    />
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
                            {supportEmail && (
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
