// @flow
import * as React from "react";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "react-ui-validations";
import RemoveIcon from "@skbkontur/react-icons/Remove";
import AddIcon from "@skbkontur/react-icons/Add";
import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import Gapped from "retail-ui/components/Gapped";
import Input from "retail-ui/components/Input";
import Textarea from "retail-ui/components/Textarea";
import Button from "retail-ui/components/Button";
import Link from "retail-ui/components/Link";
import Tooltip from "retail-ui/components/Tooltip";
import RadioGroup from "retail-ui/components/RadioGroup";
import Radio from "retail-ui/components/Radio";
import Checkbox from "retail-ui/components/Checkbox";
import type { Trigger } from "../../Domain/Trigger";
import TriggerDataSources from "../../Domain/Trigger";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import TriggerModeEditor from "../TriggerModeEditor/TriggerModeEditor";
import StatusSelect from "../StatusSelect/StatusSelect";
import { Statuses } from "../../Domain/Status";
import CodeRef from "../CodeRef/CodeRef";
import TagSelector from "../TagSelector/TagSelector";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../Helpers/Formats";
import cn from "./TriggerEditForm.less";

type Props = {|
    data: $Shape<Trigger>,
    tags: Array<string>,
    onChange: ($Shape<Trigger>) => void,
    remoteAllowed: ?boolean,
|};

export default class TriggerEditForm extends React.Component<Props, State> {
    props: Props;

    static validateRequiredString(value: string, message?: string): ?ValidationInfo {
        return value.trim().length === 0
            ? {
                  type: value.trim().length === 0 ? "submit" : "lostfocus",
                  message: message || "Can't be empty",
              }
            : null;
    }

    static validateRequiredNumber(value: ?number): ?ValidationInfo {
        return typeof value !== "number"
            ? {
                  type: typeof value === "number" ? "lostfocus" : "submit",
                  message: "Can't be empty",
              }
            : null;
    }

    static validateTTL(value: ?number): ?ValidationInfo {
        if (typeof value !== "number") {
            return {
                type: typeof value === "number" ? "lostfocus" : "submit",
                message: "Can't be empty",
            };
        }

        if (value < 0) {
            return {
                type: typeof value === "number" ? "lostfocus" : "submit",
                message: "Can't be negative",
            };
        }

        return null;
    }

    render(): React.Node {
        const { data, onChange, tags: allTags, remoteAllowed } = this.props;
        const {
            name,
            desc,
            targets,
            tags,
            expression,
            ttl,
            ttl_state: ttlState,
            sched,
            is_remote: isRemote,
            trigger_type: triggerType,
            mute_new_metrics: muteNewMetrics,
        } = data;

        if (sched == null) {
            throw new Error("InvalidProgramState");
        }

        return (
            <Form>
                <FormRow label="Name">
                    <ValidationWrapperV1
                        validationInfo={TriggerEditForm.validateRequiredString(name)}
                        renderMessage={tooltip("right middle")}
                    >
                        <Input
                            width="100%"
                            value={name}
                            onChange={(e, value) => onChange({ name: value })}
                        />
                    </ValidationWrapperV1>
                </FormRow>
                <FormRow label="Description" useTopAlignForLabel>
                    <Textarea
                        width="100%"
                        value={desc || ""}
                        onChange={(e, value) => onChange({ desc: value })}
                    />
                </FormRow>
                <FormRow label="Target" useTopAlignForLabel>
                    {targets.map((x, i) => (
                        /* eslint-disable-next-line react/no-array-index-key */
                        <div key={`target-${i}`} className={cn("target")}>
                            <span className={cn("target-number")}>T{i + 1}</span>
                            <div className={cn("fgroup")}>
                                <div className={cn("fgroup-field")}>
                                    <ValidationWrapperV1
                                        validationInfo={TriggerEditForm.validateRequiredString(x)}
                                        renderMessage={tooltip("right middle")}
                                    >
                                        <Input
                                            width="100%"
                                            value={x}
                                            onChange={(e, value) =>
                                                this.handleUpdateTarget(i, value)
                                            }
                                        />
                                    </ValidationWrapperV1>
                                </div>
                                {targets.length > 1 && (
                                    <div className={cn("fgroup-control")}>
                                        <Button onClick={() => this.handleRemoveTarget(i)}>
                                            <RemoveIcon />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button use="link" icon={<AddIcon />} onClick={() => this.handleAddTarget()}>
                        Add one more
                    </Button>
                </FormRow>

                <FormRow>
                    <TriggerModeEditor
                        triggerType={triggerType}
                        value={{ error_value: data.error_value, warn_value: data.warn_value }}
                        expression={expression}
                        validateExpression={TriggerEditForm.validateRequiredString}
                        disableSimpleMode={targets.length > 1}
                        onChange={value => onChange(value)}
                    />
                </FormRow>

                <FormRow singleLineControlGroup>
                    <StatusSelect
                        value={ttlState}
                        availableStatuses={Object.keys(Statuses).filter(
                            x => x !== Statuses.EXCEPTION
                        )}
                        onChange={value => onChange({ ttl_state: value })}
                    />
                    <span>if has no value for</span>
                    <ValidationWrapperV1
                        validationInfo={TriggerEditForm.validateTTL(ttl)}
                        renderMessage={tooltip("right middle")}
                    >
                        <FormattedNumberInput
                            width={80}
                            value={typeof ttl === "number" ? ttl : null}
                            editFormat={defaultNumberEditFormat}
                            viewFormat={defaultNumberViewFormat}
                            onChange={(e, value) => onChange({ ttl: value || 0 })}
                        />
                    </ValidationWrapperV1>
                    <span>seconds</span>
                </FormRow>
                <FormRow singleLineControlGroup>
                    <Checkbox
                        checked={muteNewMetrics}
                        onChange={(evt, checked) => onChange({ mute_new_metrics: checked })}
                    >
                        Mute new metrics notifications
                    </Checkbox>
                    <Tooltip
                        pos="bottom left"
                        render={this.renderNewMetricsAlertingHelp}
                        trigger="click"
                    >
                        <HelpDotIcon color="#3072c4" />
                    </Tooltip>
                </FormRow>
                <FormRow label="Watch time">
                    <ScheduleEdit
                        schedule={sched}
                        onChange={schedule => onChange({ sched: schedule })}
                    />
                </FormRow>
                <FormRow label="Tags" useTopAlignForLabel>
                    <ValidationWrapperV1
                        validationInfo={
                            tags.length === 0
                                ? {
                                      type: "submit",
                                      message: "Select at least one tag",
                                  }
                                : null
                        }
                        renderMessage={tooltip("right top")}
                    >
                        <TagSelector
                            allItems={allTags}
                            selectedItems={tags}
                            onChange={selectedTags => onChange({ tags: selectedTags })}
                            allowAddTag
                        />
                    </ValidationWrapperV1>
                </FormRow>
                {remoteAllowed && (
                    <FormRow label="Data source" singleLineControlGroup>
                        <RadioGroup
                            name="data-source"
                            defaultValue={
                                !isRemote ? TriggerDataSources.REDIS : TriggerDataSources.GRAPHITE
                            }
                            onChange={(evt, value) =>
                                onChange({ is_remote: value !== TriggerDataSources.REDIS })
                            }
                        >
                            <Gapped vertical gap={10}>
                                <Radio value={TriggerDataSources.REDIS}>Redis (default)</Radio>
                                <Radio value={TriggerDataSources.GRAPHITE}>
                                    Graphite. Be careful, it may cause{" "}
                                    <Link href="http://moira.readthedocs.io/en/latest/user_guide/advanced.html#data-source">
                                        extra load
                                    </Link>
                                </Radio>
                            </Gapped>
                        </RadioGroup>
                    </FormRow>
                )}
            </Form>
        );
    }

    handleUpdateTarget(targetIndex: number, value: string) {
        const { onChange, data } = this.props;
        const { targets } = data;

        onChange({
            targets: [...targets.slice(0, targetIndex), value, ...targets.slice(targetIndex + 1)],
        });
    }

    handleRemoveTarget(targetIndex: number) {
        const { onChange, data } = this.props;
        const { targets } = data;

        onChange({
            targets: [...targets.slice(0, targetIndex), ...targets.slice(targetIndex + 1)],
        });
    }

    handleAddTarget() {
        const { onChange, data } = this.props;
        const { targets } = data;

        onChange({
            trigger_type: "expression",
            targets: [...targets, ""],
        });
    }

    renderNewMetricsAlertingHelp = () => (
        <div className={cn("new-metrics-help")}>
            <p>If disabled, Moira will notify you about new metrics.</p>
            <p>
                In this case when you start sending new metric you will receive{" "}
                <CodeRef>NODATA</CodeRef> - <CodeRef>OK</CodeRef> notification.
            </p>
        </div>
    );
}

type FormProps = {
    children: any,
};

function Form({ children }: FormProps): React.Node {
    return <div className={cn("form")}>{children}</div>;
}

type FormRowProps = {
    label?: string,
    useTopAlignForLabel?: boolean,
    singleLineControlGroup?: boolean,
    style?: {},
    children: any,
};

function FormRow({
    label,
    useTopAlignForLabel,
    singleLineControlGroup,
    children,
    style,
}: FormRowProps): React.Node {
    return (
        <div className={cn("row")}>
            {label != null && (
                <div className={cn("label", { "label-for-group": useTopAlignForLabel })}>
                    {label}
                </div>
            )}
            <div className={cn("control")}>
                <div style={style} className={cn({ group: singleLineControlGroup })}>
                    {children}
                </div>
            </div>
        </div>
    );
}
