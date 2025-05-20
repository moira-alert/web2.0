import React, { FC } from "react";
import { ValidationWrapperV1, tooltip } from "@skbkontur/react-ui-validations";
import {
    validateClusterID,
    validateRequiredString,
    validateSched,
    validateTTL,
} from "./Validations/validations";
import { Checkbox, Input, Textarea } from "@skbkontur/react-ui";
import {
    DEFAULT_TRIGGER_TTL,
    DEFAULT_TRIGGER_TYPE,
    Trigger,
    TriggerSource,
    ValidateTargetsResult,
} from "../../Domain/Trigger";
import { TMetricSourceCluster } from "../../Domain/Metric";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../helpers/Formats";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import { ValueType, TriggerModeEditor } from "../TriggerModeEditor/TriggerModeEditor";
import StatusSelect from "../StatusSelect/StatusSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import { Status, StatusesList } from "../../Domain/Status";
import CodeRef from "../CodeRef/CodeRef";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import EditDescriptionHelp from "./Components/EditDescritionHelp";
import { MetricSourceSelect } from "./Components/MetricSourceSelect";
import { TargetsList } from "./Components/TargetsList";
import { Form, FormRow } from "./Components/Form";
import { Markdown } from "../Markdown/Markdown";
import { useEditPreviewTabs } from "../../hooks/useEditPreviewTabs/useEditPreviewTabs";
import { ClusterSelect } from "./Components/ClusterSelect";
import classNames from "classnames/bind";

import styles from "./TriggerEditForm.less";

const cn = classNames.bind(styles);

interface IProps {
    data: Partial<Trigger>;
    tags: Array<string>;
    remoteAllowed?: boolean | null;
    metricSourceClusters?: TMetricSourceCluster[] | null;
    onChange: (trigger: Partial<Trigger>, targetIndex?: number) => void;
    validationResult?: ValidateTargetsResult;
}

const TriggerEditForm: FC<IProps> = ({
    data,
    tags: allTags,
    remoteAllowed,
    metricSourceClusters,
    onChange,
    validationResult,
}) => {
    const { descriptionView, EditPreviewComponent } = useEditPreviewTabs();

    const {
        name,
        desc,
        targets,
        tags,
        expression,
        ttl,
        ttl_state: ttlState,
        sched,
        trigger_source: triggerSource,
        cluster_id,
        trigger_type: triggerType,
        mute_new_metrics: muteNewMetrics,
        alone_metrics: aloneMetrics,
    } = data;

    const triggerModeEditorValue: ValueType = {
        error_value: data.error_value ?? null,
        warn_value: data.warn_value ?? null,
    };

    return (
        <Form>
            <FormRow label="Name">
                <ValidationWrapperV1
                    validationInfo={validateRequiredString(name ?? "")}
                    renderMessage={tooltip("right middle")}
                >
                    <Input
                        width="100%"
                        value={name}
                        onValueChange={(value) => onChange({ name: value })}
                        data-tid="Name"
                    />
                </ValidationWrapperV1>
            </FormRow>
            <FormRow label="Description" useTopAlignForLabel>
                <div className={cn("description-mode-tabs")}>
                    <EditPreviewComponent />
                </div>
                {descriptionView === "edit" ? (
                    <>
                        <Textarea
                            width="100%"
                            value={desc || ""}
                            data-tid="Description"
                            onValueChange={(value) => onChange({ desc: value })}
                        />
                        <EditDescriptionHelp />
                    </>
                ) : (
                    <Markdown
                        className={cn("wysiwyg", "description-preview")}
                        markdown={desc || ""}
                    />
                )}
            </FormRow>
            {remoteAllowed && (
                <FormRow label="Data source" singleLineControlGroup>
                    <MetricSourceSelect
                        triggerSource={triggerSource}
                        onSourceChange={(value: TriggerSource) =>
                            onChange({ trigger_source: value })
                        }
                    />
                </FormRow>
            )}
            {metricSourceClusters && triggerSource && (
                <FormRow label="Cluster">
                    <ValidationWrapperV1
                        validationInfo={validateClusterID(
                            cluster_id,
                            triggerSource,
                            metricSourceClusters
                        )}
                        renderMessage={tooltip("right middle")}
                    >
                        <ClusterSelect
                            triggerSource={triggerSource}
                            metricSourceClusters={metricSourceClusters}
                            onChange={onChange}
                            clusterID={cluster_id}
                        />
                    </ValidationWrapperV1>
                </FormRow>
            )}
            <FormRow label="Target" useTopAlignForLabel>
                <TargetsList
                    targets={targets ?? [""]}
                    alone_metrics={aloneMetrics ?? {}}
                    trigger_source={triggerSource ?? TriggerSource.GRAPHITE_LOCAL}
                    validationResult={validationResult}
                    onChange={(value) => onChange(value)}
                />
            </FormRow>

            <FormRow>
                <TriggerModeEditor
                    triggerType={triggerType ?? DEFAULT_TRIGGER_TYPE}
                    value={triggerModeEditorValue}
                    expression={expression ?? ""}
                    validateExpression={validateRequiredString}
                    disableSimpleMode={targets && targets.length > 1}
                    onChange={onChange}
                />
            </FormRow>

            <FormRow singleLineControlGroup>
                <StatusSelect
                    value={ttlState}
                    availableStatuses={StatusesList.filter((x) => x !== Status.EXCEPTION)}
                    onChange={(value) => onChange({ ttl_state: value })}
                />
                <span>if has no value for</span>
                <ValidationWrapperV1
                    validationInfo={validateTTL(ttl)}
                    renderMessage={tooltip("right middle")}
                >
                    <FormattedNumberInput
                        width={80}
                        value={typeof ttl === "number" ? ttl : DEFAULT_TRIGGER_TTL}
                        editFormat={defaultNumberEditFormat}
                        viewFormat={defaultNumberViewFormat}
                        onValueChange={(value) => onChange({ ttl: value ?? 0 })}
                    />
                </ValidationWrapperV1>
                <span>seconds</span>
            </FormRow>
            <FormRow singleLineControlGroup>
                <Checkbox
                    checked={muteNewMetrics}
                    onValueChange={(checked) => onChange({ mute_new_metrics: checked })}
                >
                    Mute new metrics notifications
                </Checkbox>
                <HelpTooltip>
                    <div className={cn("new-metrics-help")}>
                        <p>If disabled, Moira will notify you about new metrics.</p>
                        <p>
                            In this case when you start sending new metric you will receive{" "}
                            <CodeRef>NODATA</CodeRef> - <CodeRef>OK</CodeRef> notification.
                        </p>
                    </div>
                </HelpTooltip>
            </FormRow>
            <FormRow label="Schedule">
                <ValidationWrapperV1
                    validationInfo={validateSched(sched)}
                    renderMessage={tooltip("top left")}
                >
                    <ScheduleEdit
                        schedule={sched}
                        onChange={(schedule) => onChange({ sched: schedule })}
                    />
                </ValidationWrapperV1>
            </FormRow>
            <FormRow label="Tags" useTopAlignForLabel>
                <ValidationWrapperV1
                    validationInfo={
                        tags?.length === 0
                            ? {
                                  type: "submit",
                                  message: "Select at least one tag",
                              }
                            : null
                    }
                    renderMessage={tooltip("right top")}
                >
                    <TagDropdownSelect
                        allowCreateNewTags
                        value={tags ?? []}
                        availableTags={allTags}
                        width={650}
                        onChange={(selectedTags: string[]) =>
                            onChange({
                                tags: selectedTags,
                            })
                        }
                        data-tid="Tags"
                    />
                </ValidationWrapperV1>
            </FormRow>
        </Form>
    );
};

export default TriggerEditForm;
