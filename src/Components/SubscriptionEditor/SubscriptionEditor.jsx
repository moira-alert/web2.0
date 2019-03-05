// @flow
import * as React from "react";
import Toggle from "retail-ui/components/Toggle";
import Checkbox from "retail-ui/components/Checkbox";
import Tooltip from "retail-ui/components/Tooltip";
import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "react-ui-validations";
import type { Contact } from "../../Domain/Contact";
import type { Schedule } from "../../Domain/Schedule";
import ContactSelect from "../ContactSelect/ContactSelect";
import ScheduleEdit from "../ScheduleEdit/ScheduleEdit";
import CodeRef from "../CodeRef/CodeRef";
import TagSelector from "../TagSelector/TagSelector";
import cn from "./SubscriptionEditor.less";

export type SubscriptionInfo = {
    sched: Schedule,
    tags: Array<string>,
    throttling: boolean,
    contacts: Array<string>,
    enabled: boolean,
    ignore_warnings: boolean,
    ignore_recoverings: boolean,
    plotting?: {
        enabled: boolean,
        theme: "light" | "dark",
    },
};

type Props = {
    subscription: SubscriptionInfo,
    onChange: ($Shape<SubscriptionInfo>) => void,
    tags: Array<string>,
    contacts: Array<Contact>,
};

export default class SubscriptionEditor extends React.Component<Props> {
    props: Props;

    render(): React.Node {
        const { subscription, contacts, onChange, tags } = this.props;
        const { plotting = { enabled: true, theme: "light" } } = subscription;

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
                                onChange={contactIds => onChange({ contacts: contactIds })}
                                availableContacts={contacts}
                            />
                        </ValidationWrapperV1>
                    </div>
                </div>
                <div className={cn("row")}>
                    <div className={cn("caption")}>
                        Tags:{" "}
                        <Tooltip
                            trigger="click"
                            render={this.renderTagsExplanation}
                            closeButton={false}
                            pos="right middle"
                        >
                            <HelpDotIcon color="#3072c4" />
                        </Tooltip>
                    </div>
                    <div className={cn("value", "with-input")}>
                        <ValidationWrapperV1
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.validateTags()}
                        >
                            <TagSelector
                                allItems={tags}
                                selectedItems={subscription.tags}
                                onChange={selectedTags => onChange({ tags: selectedTags })}
                            />
                        </ValidationWrapperV1>
                    </div>
                </div>
                <div className={cn("row")}>
                    <div className={cn("caption")}>Delivery schedule:</div>
                    <div className={cn("value")}>
                        <ScheduleEdit
                            schedule={subscription.sched}
                            onChange={value => onChange({ sched: value })}
                        />
                    </div>
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={subscription.throttling}
                        onChange={(e, checked) => onChange({ throttling: checked })}
                    >
                        Throttle messages
                    </Checkbox>{" "}
                    <Tooltip
                        trigger="click"
                        render={this.renderThrottlingExplanation}
                        closeButton={false}
                        pos="right middle"
                    >
                        <HelpDotIcon color="#3072c4" />
                    </Tooltip>
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={subscription.ignore_recoverings}
                        onChange={(e, checked) => onChange({ ignore_recoverings: checked })}
                    >
                        Send notifications when triggers degraded only
                    </Checkbox>{" "}
                    <Tooltip
                        trigger="click"
                        render={this.renderDegradationExplanation}
                        closeButton={false}
                        pos="right middle"
                    >
                        <HelpDotIcon color="#3072c4" />
                    </Tooltip>
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={subscription.ignore_warnings}
                        onChange={(e, checked) => onChange({ ignore_warnings: checked })}
                    >
                        Do not send <CodeRef>WARN</CodeRef> notifications
                    </Checkbox>{" "}
                    <Tooltip
                        trigger="click"
                        render={this.renderWarnExclusionExplanation}
                        closeButton={false}
                        pos="right middle"
                    >
                        <HelpDotIcon color="#3072c4" />
                    </Tooltip>
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={plotting.enabled}
                        onChange={(evt, checked) =>
                            onChange({ plotting: { ...plotting, enabled: checked } })
                        }
                    >
                        Add graph to notification
                    </Checkbox>
                    {plotting.enabled && (
                        <div className={cn("row-options")}>
                            {/* eslint-disable */}
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
                            {/* eslint-enable */}
                        </div>
                    )}
                </div>
                <div className={cn("row")}>
                    <Checkbox
                        checked={subscription.enabled}
                        onChange={(e, checked) => onChange({ enabled: checked })}
                    >
                        Enabled
                    </Checkbox>{" "}
                </div>
            </div>
        );
    }

    renderThrottlingExplanation = () => (
        <span>If trigger emit to many events they will be grouped into single message.</span>
    );

    renderTagsExplanation = () => (
        <span>
            Notification will be sent if trigger contains <strong>ALL</strong> of selected tags.
        </span>
    );

    renderDegradationExplanation = () => (
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

    renderWarnExclusionExplanation = () => (
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

    validateContacts(): ?ValidationInfo {
        const { subscription } = this.props;
        if (subscription.contacts.length === 0) {
            return {
                message: "Please add one or more delivery channels",
                type: "submit",
            };
        }
        return null;
    }

    validateTags(): ?ValidationInfo {
        const { subscription } = this.props;
        if (subscription.tags.length === 0) {
            return {
                message: "Please add one or more tags",
                type: "submit",
            };
        }
        return null;
    }
}
