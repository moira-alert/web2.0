// @flow
import * as React from "react";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "@skbkontur/react-ui-validations";
import Remarkable from "remarkable";
import { sanitize } from "dompurify";
import RemoveIcon from "@skbkontur/react-icons/Remove";
import AddIcon from "@skbkontur/react-icons/Add";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Textarea } from "@skbkontur/react-ui/components/Textarea";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Link } from "@skbkontur/react-ui/components/Link";
import { Tabs } from "@skbkontur/react-ui/components/Tabs";
import { RadioGroup } from "@skbkontur/react-ui/components/RadioGroup";
import { Radio } from "@skbkontur/react-ui/components/Radio";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { RowStack, Fill, Fit } from "@skbkontur/react-stack-layout";
import type { Trigger } from "../../Domain/Trigger";
import TriggerDataSources from "../../Domain/Trigger";
import { purifyConfig } from "../../Domain/DOMPurify";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import TriggerModeEditor from "../TriggerModeEditor/TriggerModeEditor";
import StatusSelect from "../StatusSelect/StatusSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import { Statuses } from "../../Domain/Status";
import CodeRef from "../CodeRef/CodeRef";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../helpers/Formats";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import EditDescriptionHelp from "./EditDescritionHelp";
import cn from "./TriggerEditForm.less";

const md = new Remarkable({ breaks: true });

type Props = {|
    data: $Shape<Trigger>,
    tags: Array<string>,
    onChange: ($Shape<Trigger>) => void,
    remoteAllowed: ?boolean,
|};

type State = {
    descriptionMode: "edit" | "preview",
};

export default class TriggerEditForm extends React.Component<Props, State> {
    props: Props;

    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            descriptionMode: "edit",
        };
    }

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
        const { descriptionMode } = this.state;
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
            alone_metrics: aloneMetrics,
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
                            onValueChange={value => onChange({ name: value })}
                        />
                    </ValidationWrapperV1>
                </FormRow>
                <FormRow label="Description" useTopAlignForLabel>
                    <div className={cn("description-mode-tabs")}>
                        <Tabs
                            value={descriptionMode}
                            onValueChange={value => this.setState({ descriptionMode: value })}
                        >
                            <Tabs.Tab id="edit">Edit</Tabs.Tab>
                            <Tabs.Tab id="preview">Preview</Tabs.Tab>
                        </Tabs>
                    </div>
                    {descriptionMode === "edit" ? (
                        <>
                            <Textarea
                                width="100%"
                                value={desc || ""}
                                onValueChange={value => onChange({ desc: value })}
                            />
                            <EditDescriptionHelp />
                        </>
                    ) : (
                        <div
                            className={cn("wysiwyg", "description-preview")}
                            dangerouslySetInnerHTML={{
                                __html: sanitize(md.render(desc || ""), purifyConfig),
                            }}
                        />
                    )}
                </FormRow>
                <FormRow label="Target" useTopAlignForLabel>
                    {targets.map((x, i) => (
                        /* eslint-disable-next-line react/no-array-index-key */
                        <div key={`target-${i}`} className={cn("target")}>
                            <span className={cn("target-number")}>T{i + 1}</span>
                            <RowStack block verticalAlign="baseline" gap={1}>
                                <Fill>
                                    <ValidationWrapperV1
                                        validationInfo={TriggerEditForm.validateRequiredString(x)}
                                        renderMessage={tooltip("right middle")}
                                    >
                                        <Input
                                            width="100%"
                                            value={x}
                                            onValueChange={value =>
                                                this.handleUpdateTarget(i, value)
                                            }
                                        />
                                    </ValidationWrapperV1>
                                </Fill>
                                {targets.length > 1 && (
                                    <Fit>
                                        <Checkbox
                                            checked={
                                                aloneMetrics !== undefined &&
                                                aloneMetrics !== null &&
                                                aloneMetrics[`t${i + 1}`]
                                            }
                                            onValueChange={value =>
                                                this.handleUpdateAloneMetrics(i, value)
                                            }
                                        >
                                            Single
                                        </Checkbox>
                                    </Fit>
                                )}
                                {targets.length > 1 && (
                                    <Fit>
                                        <Button onClick={() => this.handleRemoveTarget(i)}>
                                            <RemoveIcon />
                                        </Button>
                                    </Fit>
                                )}
                            </RowStack>
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
                            onChange={value => onChange({ ttl: value || 0 })}
                        />
                    </ValidationWrapperV1>
                    <span>seconds</span>
                </FormRow>
                <FormRow singleLineControlGroup>
                    <Checkbox
                        checked={muteNewMetrics}
                        onValueChange={checked => onChange({ mute_new_metrics: checked })}
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
                        <TagDropdownSelect
                            allowCreateNewTags
                            value={tags}
                            availableTags={allTags}
                            width={650}
                            onChange={selectedTags =>
                                onChange({
                                    tags: selectedTags,
                                })
                            }
                        />
                    </ValidationWrapperV1>
                </FormRow>
                {remoteAllowed && (
                    <FormRow label="Data source" singleLineControlGroup>
                        <RadioGroup
                            name="data-source"
                            defaultValue={
                                !isRemote ? TriggerDataSources.LOCAL : TriggerDataSources.GRAPHITE
                            }
                            onValueChange={value =>
                                onChange({ is_remote: value !== TriggerDataSources.LOCAL })
                            }
                        >
                            <Gapped vertical gap={10}>
                                <Radio value={TriggerDataSources.LOCAL}>Local (default)</Radio>
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

    handleUpdateAloneMetrics(targetIndex: number, value: boolean) {
        const { onChange, data } = this.props;
        let { alone_metrics: aloneMetrics } = data;
        const target = `t${targetIndex + 1}`;

        if (aloneMetrics === undefined || aloneMetrics === null) {
            aloneMetrics = {};
        }

        aloneMetrics[target] = value;
        onChange({
            alone_metrics: aloneMetrics,
        });
    }

    handleRemoveTarget(targetIndex: number) {
        const { onChange, data } = this.props;
        const { targets, alone_metrics: aloneMetrics } = data;
        const aloneMetricsIndex = [];

        for (let i = 0; i < targets.length; i += 1) {
            const target = `t${i + 1}`;
            aloneMetricsIndex[i] =
                aloneMetrics !== undefined && aloneMetrics !== null && aloneMetrics[target];
        }

        const newAloneMetricsIndex = [
            ...aloneMetricsIndex.slice(0, targetIndex),
            ...aloneMetricsIndex.slice(targetIndex + 1),
        ];

        const newAloneMetrics = {};
        for (let i = 0; i < targets.length; i += 1) {
            const target = `t${i + 1}`;
            if (newAloneMetricsIndex[i]) {
                newAloneMetrics[target] = newAloneMetricsIndex[i];
            }
        }

        onChange({
            targets: [...targets.slice(0, targetIndex), ...targets.slice(targetIndex + 1)],
            alone_metrics: newAloneMetrics,
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
