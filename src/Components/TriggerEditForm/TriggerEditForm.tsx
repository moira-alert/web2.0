import * as React from "react";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import Remarkable from "remarkable";
import { sanitize } from "dompurify";
import debounce from "lodash/debounce";
import RemoveIcon from "@skbkontur/react-icons/Remove";
import { Toast } from "@skbkontur/react-ui/components/Toast/Toast";
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
import {
    DEFAULT_TRIGGER_TTL,
    DEFAULT_TRIGGER_TYPE,
    LOW_TRIGGER_TTL,
    Trigger,
    ValidateTriggerResult,
} from "../../Domain/Trigger";
import TriggerDataSources from "../../Domain/Trigger";
import { purifyConfig } from "../../Domain/DOMPurify";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../helpers/Formats";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import TriggerModeEditor, { ValueType } from "../TriggerModeEditor/TriggerModeEditor";
import StatusSelect from "../StatusSelect/StatusSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import { Status, StatusesList } from "../../Domain/Status";
import CodeRef from "../CodeRef/CodeRef";
import HighlightInput from "../HighlightInput/HighlightInput";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import EditDescriptionHelp from "./EditDescritionHelp";
import cn from "./TriggerEditForm.less";

const md = new Remarkable({ breaks: true });

type Props = {
    data: Partial<Trigger>;
    tags: Array<string>;
    remoteAllowed?: boolean | null;
    onChange: (trigger: Partial<Trigger>, callback?: () => void) => void;
    validateTrigger: (trigger: Partial<Trigger>) => Promise<ValidateTriggerResult>;
};

type State = {
    descriptionMode: "edit" | "preview";
    validationResult?: ValidateTriggerResult;
};

function getAsyncValidator() {
    let storage;
    return async (
        condition: Promise<ValidateTriggerResult>,
        callback: (value: ValidateTriggerResult) => void
    ) => {
        storage = condition;
        try {
            const result = await condition;

            if (storage === condition) {
                callback(result);
            }
        } catch (e) {
            Toast.push(e.toString());
        }
    };
}

export default class TriggerEditForm extends React.Component<Props, State> {
    public state: State = {
        descriptionMode: "edit",
    };

    private asyncValidator = getAsyncValidator();

    static validateRequiredString(
        value: string,
        message?: string
    ): ValidationInfo | null | undefined {
        return value.trim().length === 0
            ? {
                  type: value.trim().length === 0 ? "submit" : "lostfocus",
                  message: message || "Can't be empty",
              }
            : null;
    }

    static validateRequiredNumber(value?: number | null): ValidationInfo | null {
        return typeof value !== "number"
            ? {
                  type: "submit",
                  message: "Can't be empty",
              }
            : null;
    }

    static validateTTL(value?: number): ValidationInfo | null {
        if (value === undefined) {
            return {
                type: "submit",
                message: "Can't be empty",
            };
        }

        if (value <= 0) {
            return {
                type: "lostfocus",
                message: "Can't be zero or negative",
            };
        }

        if (value < LOW_TRIGGER_TTL) {
            return {
                type: "lostfocus",
                level: "warning",
                message: "Low TTL can lead to false positives",
            };
        }

        return null;
    }

    render(): React.ReactElement {
        const { descriptionMode, validationResult } = this.state;
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

        const triggerModeEditorValue: ValueType = {
            error_value: data.error_value ?? null,
            warn_value: data.warn_value ?? null,
        };

        return (
            <Form>
                <FormRow label="Name">
                    <ValidationWrapperV1
                        validationInfo={TriggerEditForm.validateRequiredString(name ?? "")}
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
                        <Tabs
                            value={descriptionMode}
                            onValueChange={(value) =>
                                this.setState({ descriptionMode: value as "edit" | "preview" })
                            }
                        >
                            <Tabs.Tab id="edit" data-tid="Description Edit">
                                Edit
                            </Tabs.Tab>
                            <Tabs.Tab id="preview" data-tid="Description Preview">
                                Preview
                            </Tabs.Tab>
                        </Tabs>
                    </div>
                    {descriptionMode === "edit" ? (
                        <>
                            <Textarea
                                width="100%"
                                value={desc || ""}
                                onValueChange={(value) => onChange({ desc: value })}
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
                    {targets?.map((x, i) => (
                        <div key={`target-${i}`} className={cn("target")}>
                            <span className={cn("target-number")}>T{i + 1}</span>
                            <RowStack block verticalAlign="baseline" gap={1}>
                                <Fill>
                                    <HighlightInput
                                        width="100%"
                                        value={x}
                                        onValueChange={(value: string) =>
                                            this.handleUpdateTarget(i, value)
                                        }
                                        validate={validationResult?.targets?.[i]}
                                        data-tid={`Target T${i + 1}`}
                                    />
                                </Fill>
                                {targets.length > 1 && (
                                    <Fit>
                                        <Checkbox
                                            checked={aloneMetrics?.[`t${i + 1}`]}
                                            onValueChange={(value) =>
                                                this.handleUpdateAloneMetrics(i, value)
                                            }
                                            data-tid={`Target Single ${i + 1}`}
                                        >
                                            Single
                                        </Checkbox>
                                    </Fit>
                                )}
                                {targets.length > 1 && (
                                    <Fit>
                                        <Button
                                            onClick={() => this.handleRemoveTarget(i)}
                                            data-tid="Target Remove"
                                        >
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
                        triggerType={triggerType ?? DEFAULT_TRIGGER_TYPE}
                        value={triggerModeEditorValue}
                        expression={expression ?? ""}
                        validateExpression={TriggerEditForm.validateRequiredString}
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
                        validationInfo={TriggerEditForm.validateTTL(ttl)}
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
                <FormRow label="Watch time">
                    <ScheduleEdit
                        schedule={sched}
                        onChange={(schedule) => onChange({ sched: schedule })}
                    />
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
                {remoteAllowed && (
                    <FormRow label="Data source" singleLineControlGroup>
                        <RadioGroup<TriggerDataSources>
                            name="data-source"
                            defaultValue={
                                isRemote ? TriggerDataSources.GRAPHITE : TriggerDataSources.LOCAL
                            }
                            onValueChange={(value: TriggerDataSources) =>
                                onChange(
                                    { is_remote: value !== TriggerDataSources.LOCAL },
                                    this.handleValidateTrigger
                                )
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

    handleUpdateTarget(targetIndex: number, value: string): void {
        const { onChange, data } = this.props;
        const { targets } = data;

        onChange(
            {
                targets: [
                    ...(targets?.slice(0, targetIndex) ?? []),
                    value,
                    ...(targets?.slice(targetIndex + 1) ?? []),
                ],
            },
            this.handleDebouncedValidateTrigger
        );
    }

    handleUpdateAloneMetrics(targetIndex: number, value: boolean): void {
        const { onChange, data } = this.props;
        let { alone_metrics: aloneMetrics } = data;
        const target = `t${targetIndex + 1}`;

        if (aloneMetrics == null) {
            aloneMetrics = {};
        }

        aloneMetrics[target] = value;
        onChange({
            alone_metrics: aloneMetrics,
        });
    }

    handleRemoveTarget(targetIndex: number): void {
        const { onChange, data } = this.props;
        const { targets, alone_metrics: aloneMetrics } = data;
        const aloneMetricsIndex = [];

        for (let i = 0; i < (targets?.length ?? 0); i += 1) {
            const target = `t${i + 1}`;
            aloneMetricsIndex[i] = aloneMetrics?.[target];
        }

        const newAloneMetricsIndex = [
            ...aloneMetricsIndex.slice(0, targetIndex),
            ...aloneMetricsIndex.slice(targetIndex + 1),
        ];

        const newAloneMetrics: {
            [key: string]: boolean;
        } = {};

        for (let i = 0; i < (targets?.length ?? 0); i += 1) {
            const target = `t${i + 1}`;
            const metricIndex = newAloneMetricsIndex[i];
            if (metricIndex) {
                newAloneMetrics[target] = metricIndex;
            }
        }

        onChange(
            {
                targets: [
                    ...(targets?.slice(0, targetIndex) ?? []),
                    ...(targets?.slice(targetIndex + 1) ?? []),
                ],
                alone_metrics: newAloneMetrics,
            },
            this.handleValidateTrigger
        );
    }

    handleAddTarget(): void {
        const { onChange, data } = this.props;
        const { targets } = data;

        onChange({
            trigger_type: "expression",
            targets: [...(targets ?? []), ""],
        });
    }

    private handleValidateTrigger = () => {
        const { validateTrigger, data } = this.props;

        this.asyncValidator(validateTrigger(data), (validationResult: ValidateTriggerResult) => {
            this.setState({ validationResult });
        });
    };

    private handleDebouncedValidateTrigger = debounce(this.handleValidateTrigger, 100);
}

type FormProps = {
    children: React.ReactNode;
};

function Form({ children }: FormProps): React.ReactElement {
    return <div className={cn("form")}>{children}</div>;
}

type FormRowProps = {
    label?: string;
    useTopAlignForLabel?: boolean;
    singleLineControlGroup?: boolean;
    style?: {
        [key: string]: number | string;
    };
    children: React.ReactNode;
};

function FormRow({
    label,
    useTopAlignForLabel,
    singleLineControlGroup,
    children,
    style,
}: FormRowProps): React.ReactElement {
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
