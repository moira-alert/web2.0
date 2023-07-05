import React, { ReactElement } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import AddIcon from "@skbkontur/react-icons/Add";
import { Fill, RowStack, Fit } from "@skbkontur/react-stack-layout";
import { Subscription } from "../../Domain/Subscription";
import { createSchedule, WholeWeek } from "../../Domain/Schedule";
import { Contact } from "../../Domain/Contact";
import { notUndefined } from "../../helpers/common";
import TagGroup from "../TagGroup/TagGroup";
import ContactInfo from "../ContactInfo/ContactInfo";
import SubscriptionEditModal from "../SubscriptionEditModal/SubscriptionEditModal";
import CreateSubscriptionModal from "../CreateSubscriptionModal/CreateSubscriptionModal";
import type { SubscriptionInfo } from "../SubscriptionEditor/SubscriptionEditor";
import TagDropdownSelect from "../TagDropdownSelect/TagDropdownSelect";
import cn from "./SubscriptionList.less";
import { ConfigContext } from "../../contexts/ConfigContext";

export type { SubscriptionInfo };

type Props = {
    tags: string[];
    contacts: Contact[];
    subscriptions: Subscription[];
    onAddSubscription: (subscriptionInfo: SubscriptionInfo) => Promise<Subscription | undefined>;
    onRemoveSubscription: (subscription: Subscription) => Promise<void>;
    onUpdateSubscription: (subscription: Subscription) => Promise<void>;
    onTestSubscription: (subscription: Subscription) => Promise<void>;
};

type State = {
    newSubscriptionModalVisible: boolean;
    newSubscription?: SubscriptionInfo;
    subscriptionEditModalVisible: boolean;
    subscriptionToEdit?: Subscription;
    filterTags: string[];
};

export default class SubscriptionList extends React.Component<Props, State> {
    state: State = {
        newSubscriptionModalVisible: false,
        subscriptionEditModalVisible: false,
        filterTags: [],
    };

    render(): React.ReactElement {
        const { tags, contacts, subscriptions } = this.props;
        const {
            newSubscriptionModalVisible,
            newSubscription,
            subscriptionEditModalVisible,
            subscriptionToEdit,
            filterTags,
        } = this.state;
        const { filteredSubscriptions, availableTags } = this.filterSubscriptions();

        return (
            <div>
                {subscriptions.length > 0 ? (
                    <div>
                        <RowStack gap={1} baseline block>
                            <h2 className={cn("header")}>Subscriptions</h2>
                            <Fill />
                            <Fit>
                                <Button
                                    width={180}
                                    use="default"
                                    icon={<AddIcon />}
                                    onClick={this.handleAddSubscription}
                                >
                                    Add subscription
                                </Button>
                            </Fit>
                            <Fit>
                                <TagDropdownSelect
                                    width={280}
                                    value={filterTags}
                                    availableTags={availableTags}
                                    onChange={this.handleFilterTagsChange}
                                    placeholder=" Filter subscriptions by Tags"
                                />
                            </Fit>
                        </RowStack>
                        <div className={cn("items-container")}>
                            <table className={cn("items")}>
                                <tbody>
                                    {filteredSubscriptions.map((subscription) =>
                                        this.renderSubscriptionRow(subscription)
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    this.renderAddSubscriptionMessage()
                )}
                {newSubscriptionModalVisible && newSubscription != null && (
                    <CreateSubscriptionModal
                        subscription={newSubscription}
                        tags={tags}
                        contacts={contacts}
                        onChange={(update) =>
                            this.setState({ newSubscription: { ...newSubscription, ...update } })
                        }
                        onCancel={() => this.setState({ newSubscriptionModalVisible: false })}
                        onCreateSubscription={this.handleCreateSubscription}
                        onCreateAndTestSubscription={this.handleCreateAndTestSubscription}
                    />
                )}
                {subscriptionEditModalVisible && subscriptionToEdit != null && (
                    <SubscriptionEditModal
                        subscription={subscriptionToEdit}
                        tags={tags}
                        contacts={contacts}
                        onChange={(update) =>
                            this.setState({
                                subscriptionToEdit: { ...subscriptionToEdit, ...update },
                            })
                        }
                        onCancel={() => this.setState({ subscriptionEditModalVisible: false })}
                        onUpdateSubscription={this.handleUpdateSubscription}
                        onUpdateAndTestSubscription={this.handleUpdateAndTestSubscription}
                        onRemoveSubscription={this.handleRemoveSubscription}
                    />
                )}
            </div>
        );
    }

    handleFilterTagsChange = (tags: string[]): void => {
        this.setState({ filterTags: tags });
    };

    handleEditSubscription = (subscription: Subscription): void => {
        this.setState({
            subscriptionEditModalVisible: true,
            subscriptionToEdit: subscription,
        });
    };

    handleAddSubscription = (): void => {
        const isPlottingDefaultOn = this.context?.featureFlags?.isPlottingDefaultOn ?? true;
        this.setState({
            newSubscriptionModalVisible: true,
            newSubscription: {
                any_tags: false,
                sched: createSchedule(WholeWeek),
                tags: [],
                throttling: false,
                contacts: [],
                enabled: true,
                ignore_recoverings: false,
                ignore_warnings: false,
                plotting: {
                    enabled: isPlottingDefaultOn,
                    theme: "light",
                },
            },
        });
    };

    handleCreateSubscription = async (): Promise<void> => {
        const { onAddSubscription } = this.props;
        const { newSubscription } = this.state;
        if (newSubscription == null) {
            throw new Error("InvalidProgramState");
        }
        await onAddSubscription(newSubscription);
        this.setState({
            newSubscriptionModalVisible: false,
            newSubscription: undefined,
        });
    };

    handleCreateAndTestSubscription = async (): Promise<void> => {
        const { onAddSubscription, onTestSubscription } = this.props;
        const { newSubscription } = this.state;
        if (newSubscription == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            const subscription = await onAddSubscription(newSubscription);
            if (subscription !== null && subscription !== undefined) {
                await onTestSubscription(subscription);
            }
        } finally {
            this.setState({
                newSubscriptionModalVisible: false,
                newSubscription: undefined,
            });
        }
    };

    handleUpdateSubscription = async (): Promise<void> => {
        const { onUpdateSubscription } = this.props;
        const { subscriptionToEdit } = this.state;
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
        } finally {
            this.setState({
                subscriptionEditModalVisible: false,
                subscriptionToEdit: undefined,
            });
        }
    };

    handleUpdateAndTestSubscription = async (): Promise<void> => {
        const { onUpdateSubscription, onTestSubscription } = this.props;
        const { subscriptionToEdit } = this.state;
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
            await onTestSubscription(subscriptionToEdit);
        } finally {
            this.setState({
                subscriptionEditModalVisible: false,
                subscriptionToEdit: undefined,
            });
        }
    };

    handleRemoveSubscription = async (): Promise<void> => {
        const { onRemoveSubscription } = this.props;
        const { subscriptionToEdit } = this.state;
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onRemoveSubscription(subscriptionToEdit);
        } finally {
            this.setState({
                subscriptionEditModalVisible: false,
                subscriptionToEdit: undefined,
            });
        }
    };

    filterSubscriptions = (): {
        filteredSubscriptions: Subscription[];
        availableTags: string[];
    } => {
        const { subscriptions } = this.props;
        const { filterTags } = this.state;
        const filteredSubscriptions = subscriptions.filter((subscription) =>
            filterTags.every((x) => subscription.tags.includes(x))
        );

        return {
            filteredSubscriptions,
            availableTags: [...new Set(filteredSubscriptions.flatMap((i) => i.tags))],
        };
    };

    renderSubscriptionRow(subscription: Subscription): ReactElement {
        const { contacts } = this.props;
        return (
            <tr
                key={subscription.id}
                className={cn("item")}
                onClick={() => this.handleEditSubscription(subscription)}
            >
                <td className={cn("tags-cell")}>
                    <TagGroup tags={subscription.tags} />
                </td>
                <td className={cn("contacts-cell")}>
                    <Gapped gap={10}>
                        {subscription.contacts
                            .map((x) => contacts.find((y) => y.id === x))
                            .filter(notUndefined)
                            .map((x: Contact) => (
                                <ContactInfo key={x.id} contact={x} />
                            ))}
                    </Gapped>
                </td>
                <td className={cn("enabled-cell")}>
                    {!subscription.enabled && (
                        <span className={cn("disabled-label")}>Disabled</span>
                    )}
                </td>
            </tr>
        );
    }

    renderAddSubscriptionMessage(): ReactElement {
        return (
            <Center>
                <Gapped vertical gap={20}>
                    <div>
                        To start receiving notifications you have to{" "}
                        <Button use="link" onClick={this.handleAddSubscription}>
                            add subscription
                        </Button>
                        .
                    </div>
                    <Center>
                        <Button
                            use="primary"
                            icon={<AddIcon />}
                            onClick={this.handleAddSubscription}
                        >
                            Add subscription
                        </Button>
                    </Center>
                </Gapped>
            </Center>
        );
    }

    static contextType = ConfigContext;
}
