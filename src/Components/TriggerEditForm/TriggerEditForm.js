// @flow
import * as React from "react";
import { RowStack, Fit, Fill } from "../ItemsStack/ItemsStack";
import type { Trigger } from "../../Domain/Trigger";
import { TriggerDataSources } from "../../Domain/Trigger";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "react-ui-validations";
import Icon from "retail-ui/components/Icon";
import Gapped from "retail-ui/components/Gapped";
import Input from "retail-ui/components/Input";
import Textarea from "retail-ui/components/Textarea";
import Button from "retail-ui/components/Button";
import Tabs from "retail-ui/components/Tabs";
import Link from "retail-ui/components/Link";
import Tooltip from "retail-ui/components/Tooltip";
import RadioGroup from "retail-ui/components/RadioGroup";
import Radio from "retail-ui/components/Radio";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import TriggerSimpleModeEditor from "../TriggerSimpleModeEditor/TriggerSimpleModeEditor";
import StatusSelect from "../StatusSelect/StatusSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import { Statuses } from "../../Domain/Status";
import CodeRef from "../CodeRef/CodeRef";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../Helpers/Formats";
import cn from "./TriggerEditForm.less";
import Checkbox from "retail-ui/components/Checkbox/Checkbox";

type Props = {|
    data: $Shape<Trigger>,
    tags: Array<string>,
    onChange: ($Shape<Trigger>) => void,
    remoteAllowed: ?boolean,
|};

type State = {
    advancedMode: boolean,
};

export default class TriggerEditForm extends React.Component<Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        const { targets, trigger_type: triggerType } = props.data;
        this.state = {
            advancedMode: targets.length > 1 || triggerType === "expression",
        };
    }

    validateRequiredString(value: string, message?: string): ?ValidationInfo {
        return value.trim().length === 0
            ? {
                  type: value.trim().length === 0 ? "submit" : "lostfocus",
                  message: message || "Can't be empty",
              }
            : null;
    }

    validateRequiredNumber(value: ?number): ?ValidationInfo {
        return typeof value !== "number"
            ? {
                  type: typeof value === "number" ? "lostfocus" : "submit",
                  message: "Can't be empty",
              }
            : null;
    }

    validateTTL(value: ?number): ?ValidationInfo {
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

        this.setState({ advancedMode: true });
        onChange({
            trigger_type: "expression",
            targets: [...targets, ""],
        });
    }

    renderExpressionHelp = (): React.Node => {
        return (
            <div className={cn("expression-help")}>
                <div className={cn("main-description")}>
                    Expression uses{" "}
                    <Link target="_blank" href="https://github.com/Knetic/govaluate/blob/master/MANUAL.md">
                        govaluate
                    </Link>{" "}
                    with predefined constants:
                </div>
                <div>
                    <CodeRef>t1</CodeRef>, <CodeRef>t2</CodeRef>, ... are values from your targets.
                </div>
                <div>
                    <CodeRef>OK</CodeRef>, <CodeRef>WARN</CodeRef>, <CodeRef>ERROR</CodeRef>, <CodeRef>NODATA</CodeRef>{" "}
                    are states that must be the result of evaluation.
                </div>
                <div>
                    <CodeRef>PREV_STATE</CodeRef> is equal to previously set state, and allows you to prevent frequent
                    state changes.
                </div>

                <div className={cn("note")}>
                    NOTE: Only T1 target can resolve into multiple metrics in Advanced Mode. T2, T3, ... must resolve to
                    single metrics.
                </div>
            </div>
        );
    };

    renderNewMetricsAlertingHelp = () => {
        return (
            <div className={cn("new-metrics-help")}>
                <p>If enabled, Moira will notify you about new metrics.</p>
                <p>
                    In this case when you start sending new metric you will receive <CodeRef>NODATA</CodeRef> -{" "}
                    <CodeRef>OK</CodeRef> notification.
                </p>
            </div>
        );
    };

    render(): React.Node {
        const { advancedMode } = this.state;
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
            notify_about_new_metrics: notifyAboutNewMetrics,
        } = data;
        if (sched == null) {
            throw new Error("InvalidProgramState");
        }
        return (
            <Form>
                <FormRow label="Name">
                    <ValidationWrapperV1
                        validationInfo={this.validateRequiredString(name)}
                        renderMessage={tooltip("right middle")}>
                        <Input width="100%" value={name} onChange={(e, value) => onChange({ name: value })} />
                    </ValidationWrapperV1>
                </FormRow>
                <FormRow label="Description" useTopAlignForLabel>
                    <Textarea width="100%" value={desc || ""} onChange={(e, value) => onChange({ desc: value })} />
                </FormRow>
                <FormRow label="Target" useTopAlignForLabel>
                    {targets.map((x, i) => (
                        <div key={i} className={cn("target")}>
                            <label className={cn("target-number")}>T{i + 1}</label>
                            <div className={cn("fgroup")}>
                                <div className={cn("fgroup-field")}>
                                    <ValidationWrapperV1
                                        validationInfo={this.validateRequiredString(x)}
                                        renderMessage={tooltip("right middle")}>
                                        <Input
                                            width="100%"
                                            value={x}
                                            onChange={(e, value) => this.handleUpdateTarget(i, value)}
                                        />
                                    </ValidationWrapperV1>
                                </div>
                                {targets.length > 1 && (
                                    <div className={cn("fgroup-control")}>
                                        <Button onClick={() => this.handleRemoveTarget(i)}>
                                            <Icon name="Remove" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button use="link" icon="Add" onClick={() => this.handleAddTarget()}>
                        Add one more
                    </Button>
                </FormRow>
                <FormRow>
                    <Tabs
                        value={advancedMode ? "advanced" : "simple"}
                        onChange={(e, value) => {
                            if (targets.length === 1) {
                                this.setState({ advancedMode: value === "advanced" });
                                onChange({ trigger_type: value === "advanced" ? "expression" : "rising" });
                            }
                        }}>
                        <Tabs.Tab id="simple" style={{ color: targets.length > 1 ? "#888888" : undefined }}>
                            Simple mode
                        </Tabs.Tab>
                        <Tabs.Tab id="advanced">Advanced mode</Tabs.Tab>
                    </Tabs>
                </FormRow>
                {!advancedMode && (
                    <FormRow style={{ marginLeft: "-10px" }}>
                        <TriggerSimpleModeEditor
                            triggerType={triggerType}
                            value={{ error_value: data.error_value, warn_value: data.warn_value }}
                            onChange={value => onChange(value)}
                        />
                    </FormRow>
                )}
                {advancedMode && (
                    <FormRow label="Expression">
                        <RowStack baseline block gap={2}>
                            <Fill>
                                <ValidationWrapperV1
                                    validationInfo={this.validateRequiredString(
                                        expression,
                                        "Expression can't be empty"
                                    )}
                                    renderMessage={tooltip("right middle")}>
                                    <Input
                                        width="100%"
                                        value={expression}
                                        onChange={(e, value) => onChange({ expression: value })}
                                        placeholder="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
                                    />
                                </ValidationWrapperV1>
                            </Fill>
                            <Fit>
                                <Tooltip pos="top right" render={this.renderExpressionHelp} trigger="click">
                                    <Link icon="HelpDot" />
                                </Tooltip>
                            </Fit>
                        </RowStack>
                    </FormRow>
                )}
                <FormRow singleLineControlGroup>
                    <StatusSelect
                        value={ttlState}
                        availableStatuses={Object.keys(Statuses).filter(x => x !== Statuses.EXCEPTION)}
                        onChange={value => onChange({ ttl_state: value })}
                    />
                    <span>if has no value for</span>
                    <ValidationWrapperV1 validationInfo={this.validateTTL(ttl)} renderMessage={tooltip("right middle")}>
                        <FormattedNumberInput
                            width={80}
                            value={typeof ttl === "number" ? ttl : null}
                            editFormat={defaultNumberEditFormat}
                            viewFormat={defaultNumberViewFormat}
                            onChange={(e, value) => onChange({ ttl: value || 0 })}
                        />
                    </ValidationWrapperV1>
                </FormRow>
                <FormRow singleLineControlGroup>
                    <Checkbox
                        checked={notifyAboutNewMetrics}
                        onChange={(evt, checked) => onChange({ notify_about_new_metrics: checked })}>
                        Notify about new metrics
                    </Checkbox>
                    <Tooltip pos="bottom left" render={this.renderNewMetricsAlertingHelp} trigger="click">
                        <Link icon="HelpDot" />
                    </Tooltip>
                </FormRow>
                <FormRow label="Watch time">
                    <ScheduleEdit schedule={sched} onChange={schedule => onChange({ sched: schedule })} />
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
                        renderMessage={tooltip("right top")}>
                        <TagDropdownSelect
                            allowCreateNewTags
                            value={tags}
                            availableTags={allTags}
                            width={650}
                            onChange={tags =>
                                onChange({
                                    tags: tags,
                                })
                            }
                        />
                    </ValidationWrapperV1>
                </FormRow>
                {remoteAllowed &&
                    advancedMode && (
                        <FormRow label="Data source" singleLineControlGroup>
                            <RadioGroup
                                name="data-source"
                                defaultValue={!isRemote ? TriggerDataSources.REDIS : TriggerDataSources.GRAPHITE}
                                onChange={(evt, value) => onChange({ is_remote: value !== TriggerDataSources.REDIS })}>
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
}

type FormProps = {
    children?: any,
};

function Form({ children }: FormProps): React.Node {
    return <div className={cn("form")}>{children}</div>;
}

type FormRowProps = {
    label?: string,
    useTopAlignForLabel?: boolean,
    singleLineControlGroup?: boolean,
    style?: {},
    children?: any,
};

function FormRow({ label, useTopAlignForLabel, singleLineControlGroup, children, style }: FormRowProps): React.Node {
    return (
        <div className={cn("row")}>
            {label != null && <div className={cn("label", { ["label-for-group"]: useTopAlignForLabel })}>{label}</div>}
            <div className={cn("control")}>
                <div style={style} className={cn({ ["group"]: singleLineControlGroup })}>
                    {children}
                </div>
            </div>
        </div>
    );
}
