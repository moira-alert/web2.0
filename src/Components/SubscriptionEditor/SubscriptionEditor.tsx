import React, { FC, useMemo, useState } from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { SubscriptionCreateInfo } from "../../Domain/Subscription";
import { Contact } from "../../Domain/Contact";
import { Schedule } from "../../Domain/Schedule";
import { Subscription } from "../../Domain/Subscription";
import ContactSelect from "../ContactSelect/ContactSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import CodeRef from "../CodeRef/CodeRef";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import { ConfigState } from "../../store/selectors";
import { useAppSelector } from "../../store/hooks";
import { validateSched } from "../TriggerEditForm/Validations/validations";
import { Switcher } from "@skbkontur/react-ui";
import { Flexbox } from "../Flexbox/FlexBox";
import { Note } from "../Note/Note";
import classNames from "classnames/bind";

import styles from "./SubscriptionEditor.less";
import { useHasSystemTags } from "../../hooks/useSystemTags";

const cn = classNames.bind(styles);

enum TagsType {
    Tags = "Tags",
    SystemTags = "System tags",
}

type TSubscriptionEditorProps = {
    subscription: Subscription | SubscriptionCreateInfo;
    onChange: (subscriptionInfo: Partial<SubscriptionCreateInfo>) => void;
    tags: Array<string>;
    contacts: Array<Contact>;
};

const SubscriptionEditor: FC<TSubscriptionEditorProps> = ({
    subscription,
    contacts,
    onChange,
    tags,
}) => {
    const { config } = useAppSelector(ConfigState);
    const { systemTags, hasSystemTags } = useHasSystemTags(subscription.tags);
    const [tagsType, setTagsType] = useState<TagsType>(() =>
        hasSystemTags ? TagsType.SystemTags : TagsType.Tags
    );

    const currentTags = useMemo(() => (tagsType === TagsType.Tags ? tags : systemTags), [
        tagsType,
        tags,
        systemTags,
    ]);
    const { plotting = { enabled: true, theme: "light" } } = subscription;

    const isAllTagsToggleVisible: boolean =
        config?.featureFlags?.isSubscriptionToAllTagsAvailable ?? true;

    const isAddPlottingVisible: boolean = config?.featureFlags?.isPlottingAvailable ?? true;

    const renderDegradationExplanation = (): React.ReactElement => (
        <div>
            Only following state switches triggers notification:
            <div>
                <CodeRef>OK</CodeRef> → <CodeRef>WARN</CodeRef>
            </div>
            <div>
                <CodeRef>OK</CodeRef> → <CodeRef>ERROR</CodeRef>
            </div>
            <div>
                <CodeRef>OK</CodeRef> → <CodeRef>NODATA</CodeRef>
            </div>
            <div>
                <CodeRef>WARN</CodeRef> → <CodeRef>ERROR</CodeRef>
            </div>
            <div>
                <CodeRef>WARN</CodeRef> → <CodeRef>NODATA</CodeRef>
            </div>
            <div>
                <CodeRef>ERROR</CodeRef> → <CodeRef>NODATA</CodeRef>
            </div>
        </div>
    );

    const renderWarnExclusionExplanation = (): React.ReactElement => (
        <div>
            Do not triggers notification on following switches:
            <div>
                <CodeRef>OK</CodeRef> → <CodeRef>WARN</CodeRef>
            </div>
            <div>
                <CodeRef>WARN</CodeRef> → <CodeRef>OK</CodeRef>
            </div>
        </div>
    );

    const validateContacts = (): ValidationInfo | null => {
        if (subscription.contacts.length === 0) {
            return {
                message: "Please add one or more delivery channels",
                type: "submit",
            };
        }
        return null;
    };

    const validateTags = (): ValidationInfo | null => {
        if (subscription.tags.length === 0 && !subscription.any_tags) {
            return {
                message: "Please add one or more tags",
                type: "submit",
            };
        }
        return null;
    };

    const handleTagsTypeChange = (key: string) => {
        setTagsType(key as TagsType);
        onChange({ tags: [] });
    };

    return (
        <div className={cn("form")}>
            <div className={cn("row")}>
                <div className={cn("caption")}>Target delivery channels:</div>
                <div className={cn("value", "with-input")}>
                    <ValidationWrapperV1
                        renderMessage={tooltip("right middle")}
                        validationInfo={validateContacts()}
                    >
                        <ContactSelect
                            contactIds={subscription.contacts}
                            onChange={(contactIds) => onChange({ contacts: contactIds })}
                            availableContacts={contacts}
                        />
                    </ValidationWrapperV1>
                </div>
            </div>

            <div className={cn("row")}>
                <div className={cn("caption")}>
                    <Flexbox align="center" justify="space-between" direction="row">
                        <span>Tags:</span>
                        <Switcher
                            value={tagsType}
                            onValueChange={handleTagsTypeChange}
                            items={Object.values(TagsType)}
                        />
                    </Flexbox>
                    <div className={cn("note-container")}>
                        <Note type="info">
                            {tagsType === TagsType.Tags ? (
                                <>
                                    Notification will be sent if trigger contains{" "}
                                    <strong>ALL</strong> of selected tags.
                                </>
                            ) : (
                                <>This tags are used to notify about Moira selfstate.</>
                            )}
                        </Note>
                    </div>
                </div>

                <div className={cn("value", "with-input")}>
                    <ValidationWrapperV1
                        renderMessage={tooltip("right middle")}
                        validationInfo={validateTags()}
                    >
                        <TagDropdownSelect
                            width={440}
                            data-tid="Tag dropdown select"
                            value={subscription.tags}
                            onChange={(nextTags: string[]) => {
                                onChange({
                                    tags: nextTags,
                                });
                            }}
                            availableTags={currentTags}
                            isDisabled={subscription.any_tags}
                        />
                    </ValidationWrapperV1>
                </div>
            </div>
            {isAllTagsToggleVisible && (
                <div className={cn("row")}>
                    <span>
                        <Toggle
                            checked={subscription.any_tags}
                            onValueChange={(checked) =>
                                onChange({
                                    any_tags: checked,
                                    tags: checked ? [] : subscription.tags,
                                })
                            }
                        >
                            All tags
                        </Toggle>
                    </span>{" "}
                    <HelpTooltip closeButton={false}>
                        You will be subscribed to ALL existing tags. May cause increased loads and
                        alert spamming.
                    </HelpTooltip>
                </div>
            )}
            <div className={cn("row")}>
                <div className={cn("caption")}>Delivery schedule:</div>
                <div className={cn("value")}>
                    <ValidationWrapperV1
                        validationInfo={validateSched(subscription.sched)}
                        renderMessage={tooltip("right top")}
                    >
                        <ScheduleEdit
                            schedule={subscription.sched}
                            onChange={(value: Schedule) => onChange({ sched: value })}
                        />
                    </ValidationWrapperV1>
                </div>
            </div>
            <div className={cn("row")}>
                <Checkbox
                    checked={subscription.throttling}
                    onValueChange={(checked) => onChange({ throttling: checked })}
                >
                    Throttle messages
                </Checkbox>{" "}
                <HelpTooltip closeButton={false}>
                    If trigger emit to many events they will be grouped into single message.
                </HelpTooltip>
            </div>
            <div className={cn("row")}>
                <Checkbox
                    checked={subscription.ignore_recoverings}
                    onValueChange={(checked) => onChange({ ignore_recoverings: checked })}
                >
                    Send notifications when triggers degraded only
                </Checkbox>{" "}
                <HelpTooltip closeButton={false}>{renderDegradationExplanation()}</HelpTooltip>
            </div>
            <div className={cn("row")}>
                <Checkbox
                    checked={subscription.ignore_warnings}
                    onValueChange={(checked) => onChange({ ignore_warnings: checked })}
                >
                    Do not send <CodeRef>WARN</CodeRef> notifications
                </Checkbox>{" "}
                <HelpTooltip closeButton={false}>{renderWarnExclusionExplanation()}</HelpTooltip>
            </div>
            {isAddPlottingVisible && (
                <div className={cn("row")}>
                    <Checkbox
                        checked={plotting.enabled}
                        onValueChange={(checked) =>
                            onChange({ plotting: { ...plotting, enabled: checked } })
                        }
                    >
                        Add graph to notification
                    </Checkbox>
                    {plotting.enabled && (
                        <div className={cn("row-options")}>
                            <label>
                                Light
                                <span className={cn("graph-theme-toggle")}>
                                    <Toggle
                                        checked={plotting.theme === "dark"}
                                        onChange={() =>
                                            onChange({
                                                plotting: {
                                                    ...plotting,
                                                    theme:
                                                        plotting.theme === "dark"
                                                            ? "light"
                                                            : "dark",
                                                },
                                            })
                                        }
                                    />
                                </span>
                                Dark
                            </label>
                        </div>
                    )}
                </div>
            )}
            <div className={cn("row")}>
                <Checkbox
                    checked={subscription.enabled}
                    onValueChange={(checked) => onChange({ enabled: checked })}
                >
                    Enabled
                </Checkbox>{" "}
            </div>
        </div>
    );
};

export default SubscriptionEditor;
