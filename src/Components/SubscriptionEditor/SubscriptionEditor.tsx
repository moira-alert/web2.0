import * as React from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { SubscriptionCreateInfo } from "../../Api/MoiraApi";
import { Contact } from "../../Domain/Contact";
import { Schedule } from "../../Domain/Schedule";
import { Subscription } from "../../Domain/Subscription";
import ContactSelect from "../ContactSelect/ContactSelect";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import CodeRef from "../CodeRef/CodeRef";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import cn from "./SubscriptionEditor.less";
import { ConfigContext } from "../../contexts/ConfigContext";

export type SubscriptionInfo = Omit<SubscriptionCreateInfo, "user" | "id">;

type Props = {
    subscription: Subscription | SubscriptionInfo;
    onChange: (subscriptionInfo: Partial<SubscriptionInfo>) => void;
    tags: Array<string>;
    contacts: Array<Contact>;
};

export default class SubscriptionEditor extends React.Component<Props> {
    render(): React.ReactNode {
        const { subscription, contacts, onChange, tags } = this.props;
        const { plotting = { enabled: true, theme: "light" } } = subscription;
        const isAllTagsToggleVisible: boolean =
            this.context?.featureFlags?.isSubscriptionToAllTagsAvailable ?? true;
        const isAddPlottingVisible: boolean =
            this.context?.featureFlags?.isPlottingAvailable ?? true;
        return (
            <div className={cn("form")}>
                <div className={cn("row")}>
                    <div className={cn("caption")}>Target delivery channels:</div>
                    <div className={cn("value", "with-input")}>
                        <ValidationWrapperV1
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.validateContacts()}
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
                        Tags:{" "}
                        <HelpTooltip closeButton={false}>
                            Notification will be sent if trigger contains <strong>ALL</strong> of
                            selected tags.
                        </HelpTooltip>
                    </div>
                    <div className={cn("value", "with-input")}>
                        <ValidationWrapperV1
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.validateTags()}
                        >
                            <TagDropdownSelect
                                width={470}
                                value={subscription.tags}
                                onChange={(nextTags: string[]) => {
                                    onChange({
                                        tags: nextTags,
                                    });
                                }}
                                availableTags={tags}
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
                            You will be subscribed to ALL existing tags. May cause increased loads
                            and alert spamming.
                        </HelpTooltip>
                    </div>
                )}
                <div className={cn("row")}>
                    <div className={cn("caption")}>Delivery schedule:</div>
                    <div className={cn("value")}>
                        <ScheduleEdit
                            schedule={subscription.sched}
                            onChange={(value: Schedule) => onChange({ sched: value })}
                        />
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
                    <HelpTooltip closeButton={false}>
                        {this.renderDegradationExplanation()}
                    </HelpTooltip>
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={subscription.ignore_warnings}
                        onValueChange={(checked) => onChange({ ignore_warnings: checked })}
                    >
                        Do not send <CodeRef>WARN</CodeRef> notifications
                    </Checkbox>{" "}
                    <HelpTooltip closeButton={false}>
                        {this.renderWarnExclusionExplanation()}
                    </HelpTooltip>
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
    }

    renderDegradationExplanation = (): React.ReactElement => (
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

    renderWarnExclusionExplanation = (): React.ReactElement => (
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

    validateContacts(): ValidationInfo | null {
        const { subscription } = this.props;
        if (subscription.contacts.length === 0) {
            return {
                message: "Please add one or more delivery channels",
                type: "submit",
            };
        }
        return null;
    }

    validateTags(): ValidationInfo | null {
        const { subscription } = this.props;
        if (subscription.tags.length === 0 && !subscription.any_tags) {
            return {
                message: "Please add one or more tags",
                type: "submit",
            };
        }
        return null;
    }

    static contextType = ConfigContext;
}
