import * as React from "react";
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
import { ConfirmModalHeaderData, getPageLink } from "../../Domain/Global";
import { humanizeDuration } from "../../helpers/DateUtil";
import { omitTrigger } from "../../helpers/omitTypes";
import RouterLink from "../RouterLink/RouterLink";
import FileExport from "../FileExport/FileExport";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import { CodeEditor } from "../HighlightInput/CodeEditor";
import { Hint, DropdownMenu, MenuSeparator } from "@skbkontur/react-ui";
import { CopyButton } from "../TriggerEditForm/Components/CopyButton";
import { MarkdownViewer } from "@skbkontur/markdown";
import { WysiwygWrapper } from "../Markdown/WysiwygWrapper";
import { MetricStateChart } from "../MetricStateChart/MetricStateChart";
import { MetricItemList } from "../../Domain/Metric";
import { useAppSelector } from "../../store/hooks";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { ScheduleView } from "./Components/ScheduleView";
import { ConfigState } from "../../store/selectors";
import useConfirmModal, { ConfirmModal } from "../../hooks/useConfirmModal";
import { useNavigate } from "react-router";
import { MetricsPlotModal } from "../MetricsPlotModal/MetricsPlotModal";
import Statistic from "@skbkontur/react-icons/Statistic";
import { Flexbox } from "../Flexbox/FlexBox";
import { useModal } from "../../hooks/useModal";
import { TriggerCRUDInfo } from "./Components/TriggerCRUDInfo";
import classNames from "classnames/bind";

import styles from "./TriggerInfo.module.less";

const cn = classNames.bind(styles);

interface IProps {
    trigger: Trigger;
    triggerState: TriggerState;
    supportEmail?: string;
    metrics?: MetricItemList;
    deleteTrigger: () => void;
    onThrottlingRemove: () => void;
    onSetMaintenance: (maintenance: number) => void;
}

function maintenanceCaption(delta: number): React.ReactNode {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}

export default function TriggerInfo({
    trigger,
    triggerState,
    supportEmail,
    metrics,
    deleteTrigger,
    onThrottlingRemove,
    onSetMaintenance,
}: IProps): React.ReactElement {
    const {
        id,
        name,
        desc,
        cluster_id: clusterID,
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
        created_at,
        created_by,
        updated_at,
        updated_by,
    } = trigger;
    const { state, msg: exceptionMessage, maintenance, maintenance_info } = triggerState;
    const { config } = useAppSelector(ConfigState);
    const {
        modalData: confirmModalData,
        setModalData: setConfirmModalData,
        closeModal: closeConfirmModal,
    } = useConfirmModal();
    const navigate = useNavigate();
    const { isModalOpen, openModal, closeModal } = useModal();

    const availableClusters = config?.metric_source_clusters?.filter(
        (cluster) => cluster.trigger_source === triggerSource
    );

    const cluster = availableClusters?.find((cluster) => cluster.cluster_id === clusterID);

    const clusterName = cluster?.cluster_name;
    const metricsTtl = cluster?.metrics_ttl;

    const isClusterName = clusterName && availableClusters?.length !== 0;
    const isMetrics = metrics && Object.keys(metrics).length > 1;
    const hasExpression = expression !== null && expression !== "";
    const hasMultipleTargets = targets.length > 1;
    const delta = maintenanceDelta(maintenance);

    const onDeleteTrigger = () => {
        setConfirmModalData({ isOpen: false });
        deleteTrigger();
    };

    const handleDeleteTrigger = () => {
        setConfirmModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.deleteTrigger,
            body: (
                <>
                    Trigger <strong>{trigger.name}</strong> will be deleted.
                </>
            ),
            button: {
                text: "Delete",
                use: "danger",
                onConfirm: onDeleteTrigger,
            },
        });
    };

    return (
        <section>
            <header className={cn("header")}>
                <h1 className={cn("title")} data-tid="Name">
                    {name != null && name !== "" ? name : "[No name]"}
                </h1>
                <div className={cn("controls")}>
                    <RouterLink
                        data-tid="Edit"
                        to={getPageLink("triggerEdit", id)}
                        icon={<EditIcon />}
                    >
                        Edit
                    </RouterLink>
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
                                        {maintenance_info.setup_time !== null &&
                                            format(
                                                fromUnixTime(maintenance_info.setup_time),
                                                "MMMM d, HH:mm:ss"
                                            )}
                                    </div>
                                );
                            }}
                        >
                            <MaintenanceSelect
                                icon={<ClockIcon />}
                                maintenance={maintenance}
                                caption={maintenanceCaption(delta)}
                                onSetMaintenance={onSetMaintenance}
                            />
                        </Tooltip>
                    </span>
                    <DropdownMenu
                        caption={
                            <Button rightIcon={<ArrowTriangleDownIcon />} use="link">
                                Other
                            </Button>
                        }
                    >
                        {throttling !== 0 && (
                            <MenuItem onClick={onThrottlingRemove} icon={<ClearIcon />}>
                                Disable throttling
                            </MenuItem>
                        )}
                        <MenuItem icon={<ExportIcon />}>
                            <FileExport
                                data={omitTrigger(trigger)}
                                title={`trigger ${name || id}`}
                            />
                        </MenuItem>
                        <MenuItem
                            target={"_blank"}
                            icon={<DocumentCopyIcon />}
                            href={getPageLink("triggerDuplicate", id)}
                        >
                            Duplicate
                        </MenuItem>
                        <MenuItem onClick={openModal} icon={<Statistic />}>
                            Metrics graph
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem icon={<TrashIcon />} onClick={handleDeleteTrigger}>
                            Delete
                        </MenuItem>
                    </DropdownMenu>
                </div>
            </header>
            <div className={cn("info-section")}>
                <div className={cn("info-section")}>
                    <dl className={cn("list")}>
                        <dt>
                            Target
                            <br />
                            {triggerSourceDescription(triggerSource)}
                        </dt>
                        <dd className={cn("codeEditor")}>
                            <Flexbox gap={10}>
                                {targets.map((target, i) => (
                                    <div key={target}>
                                        <div className={cn("copyButtonWrapper")}>
                                            <Hint text="Copy without formatting">
                                                <CopyButton
                                                    className={cn("copyButton")}
                                                    value={target}
                                                />
                                            </Hint>
                                        </div>
                                        <CodeEditor
                                            data-tid={`T${i + 1}`}
                                            triggerSource={triggerSource}
                                            disabled
                                            key={i}
                                            value={target}
                                        />
                                    </div>
                                ))}
                            </Flexbox>
                        </dd>
                        {desc && <dt>Description</dt>}
                        {desc && (
                            <dd>
                                <WysiwygWrapper>
                                    <MarkdownViewer source={desc} />
                                </WysiwygWrapper>
                            </dd>
                        )}
                        {isClusterName && <dt>Cluster</dt>}
                        {isClusterName && <dd>{clusterName}</dd>}
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
                                    navigate(
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
                                            Or <Link href={`mailto:${supportEmail}`}>
                                                contact
                                            </Link>{" "}
                                            with server administrator.
                                        </span>
                                    )}
                                </div>
                            </dd>
                        )}
                        <TriggerCRUDInfo
                            created_by={created_by}
                            created_at={created_at}
                            updated_by={updated_by}
                            updated_at={updated_at}
                        />
                    </dl>
                </div>
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
            {metricsTtl && isModalOpen && (
                <MetricsPlotModal
                    closeModal={closeModal}
                    metricsTtl={metricsTtl}
                    targets={targets}
                    triggerId={id}
                />
            )}
            <ConfirmModal modalData={confirmModalData} closeModal={closeConfirmModal} />
        </section>
    );
}
