import * as React from "react";
import { History } from "history";
import { format, fromUnixTime } from "date-fns";
import queryString from "query-string";
import { Link } from "@skbkontur/react-ui/components/Link";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import ExportIcon from "@skbkontur/react-icons/Export";
import TrashIcon from "@skbkontur/react-icons/Trash";
import ErrorIcon from "@skbkontur/react-icons/Error";
import EditIcon from "@skbkontur/react-icons/Edit";
import ClearIcon from "@skbkontur/react-icons/Clear";
import ClockIcon from "@skbkontur/react-icons/Clock";
import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import DocumentCopyIcon from "@skbkontur/react-icons/DocumentCopy";
import TagGroup from "../TagGroup/TagGroup";
import {
    Trigger,
    TriggerState,
    maintenanceDelta,
    triggerSourceDescription,
} from "../../Domain/Trigger";
import { getPageLink } from "../../Domain/Global";
import { humanizeDuration } from "../../helpers/DateUtil";
import { omitTrigger } from "../../helpers/omitTypes";
import RouterLink from "../RouterLink/RouterLink";
import FileExport from "../FileExport/FileExport";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import { CodeEditor } from "../HighlightInput/CodeEditor";
import { Gapped, Hint, DropdownMenu, MenuSeparator } from "@skbkontur/react-ui";
import { CopyButton } from "../TriggerEditForm/Components/CopyButton";
import { Markdown } from "../Markdown/Markdown";
import { MetricStateChart } from "../MetricStateChart/MetricStateChart";
import { MetricItemList } from "../../Domain/Metric";
import { ConfirmDeleteModal } from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { useModal } from "../../hooks/useModal";
import { LinkMenuItem } from "./Components/LinkMenuItem";
import { ScheduleView } from "./Components/ScheduleView";
import classNames from "classnames/bind";

import styles from "./TriggerInfo.less";

const cn = classNames.bind(styles);

interface IProps {
    trigger: Trigger;
    triggerState: TriggerState;
    supportEmail?: string;
    metrics?: MetricItemList;
    deleteTrigger: (id: string) => void;
    onThrottlingRemove: (triggerId: string) => void;
    onSetMaintenance: (maintenance: number) => void;
    history: History;
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

export default function TriggerInfo({
    trigger,
    triggerState,
    supportEmail,
    metrics,
    deleteTrigger,
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
    } = trigger;
    const { state, msg: exceptionMessage, maintenance, maintenance_info } = triggerState;
    const { isModalOpen, openModal, closeModal } = useModal();

    const isMetrics = metrics && Object.keys(metrics).length > 0;
    const hasExpression = expression != null && expression !== "";
    const hasMultipleTargets = targets.length > 1;
    const delta = maintenanceDelta(maintenance);

    const onDeleteTrigger = () => {
        closeModal();
        deleteTrigger(trigger.id);
    };

    return (
        <section>
            <header className={cn("header")}>
                <h1 className={cn("title")} data-tid="Name">
                    {name != null && name !== "" ? name : "[No name]"}
                </h1>
                <div className={cn("controls")}>
                    <span className={cn("control")}>
                        <RouterLink
                            data-tid="Edit"
                            to={getPageLink("triggerEdit", id)}
                            icon={<EditIcon />}
                        >
                            Edit
                        </RouterLink>
                    </span>
                    <span className={cn("control")}>
                        <Tooltip
                            render={() => {
                                const isInfo =
                                    delta > 0 &&
                                    maintenance_info &&
                                    maintenance_info.setup_user &&
                                    maintenance_info.setup_time;

                                if (!isInfo) {
                                    return null;
                                }
                                return (
                                    <div>
                                        Maintenance was set
                                        <br />
                                        by {maintenance_info.setup_user}
                                        <br />
                                        at{" "}
                                        {format(
                                            fromUnixTime(maintenance_info.setup_time),
                                            "MMMM d, HH:mm:ss"
                                        )}
                                    </div>
                                );
                            }}
                        >
                            <MaintenanceSelect
                                maintenance={maintenance}
                                caption={maintenanceCaption(delta)}
                                onSetMaintenance={onSetMaintenance}
                            />
                        </Tooltip>
                    </span>
                    <DropdownMenu
                        caption={
                            <Button use="link">
                                Other <ArrowTriangleDownIcon color="#6b99d3" />
                            </Button>
                        }
                    >
                        {throttling !== 0 && (
                            <LinkMenuItem
                                onClick={() => onThrottlingRemove(id)}
                                icon={<ClearIcon />}
                            >
                                Disable throttling
                            </LinkMenuItem>
                        )}
                        <LinkMenuItem icon={<ExportIcon />}>
                            <FileExport
                                data={omitTrigger(trigger)}
                                title={`trigger ${name || id}`}
                            />
                        </LinkMenuItem>
                        <LinkMenuItem
                            icon={<DocumentCopyIcon />}
                            link={getPageLink("triggerDuplicate", id)}
                        >
                            Duplicate
                        </LinkMenuItem>
                        <MenuSeparator />
                        <LinkMenuItem icon={<TrashIcon />} onClick={openModal}>
                            Delete
                        </LinkMenuItem>
                    </DropdownMenu>
                </div>
            </header>
            <div className={cn("info-section")}>
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
                                            <CopyButton
                                                className={cn("copyButton")}
                                                value={target}
                                            />
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
                        <dd className={cn("description", "wysiwyg")}>
                            <Markdown markdown={desc} />
                        </dd>
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
                                <RouterLink to={`/trigger/${trigger.id}/edit`}>
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
                {isMetrics && (
                    <div className={cn("state-chart")}>
                        <MetricStateChart
                            displayLegend
                            enableTooltip
                            height={"10rem"}
                            width={"18rem"}
                            metrics={metrics}
                        />
                    </div>
                )}
            </div>
            {isModalOpen && trigger && (
                <ConfirmDeleteModal
                    message={"Delete Trigger?"}
                    onClose={closeModal}
                    onDelete={onDeleteTrigger}
                >
                    Trigger <strong>{trigger.name}</strong> will be deleted.
                </ConfirmDeleteModal>
            )}
        </section>
    );
}
