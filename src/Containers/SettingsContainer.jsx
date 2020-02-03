// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Config } from "../Domain/Config";
import type { Settings } from "../Domain/Settings";
import type { Contact } from "../Domain/Contact";
import type { Subscription } from "../Domain/Subscription";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import ContactList from "../Components/ContactList/ContactList";
import SubscriptionList, {
    type SubscriptionInfo,
} from "../Components/SubscriptionList/SubscriptionList";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    settings: ?Settings,
    config: ?Config,
    tags: ?Array<string>,
};

class SettingsContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        config: null,
        loading: true,
        error: null,
        settings: null,
        tags: null,
    };

    componentDidMount() {
        document.title = "Moira - Settings";
        this.getData();
    }

    static normalizeContactValueForApi(contactType: string, value: string): string {
        let result = value.trim();
        if (contactType === "twilio voice" || contactType === "twilio sms") {
            if (result.length >= 11) {
                result = result.replace(/^8/, "+7");
                result = result.replace(/^7/, "+7");
            } else if (result.length === 10) {
                result = `+7${result}`;
            }
            return result;
        }
        return result;
    }

    static normalizeContactValueForUi(contactType: string, value: string): string {
        return value;
    }

    render(): React.Node {
        const { loading, error, tags, settings, config } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Notifications</LayoutTitle>
                    {config != null && settings != null && settings.contacts != null && (
                        <div style={{ marginBottom: 50 }}>
                            <ContactList
                                contactDescriptions={config.contacts}
                                items={settings.contacts}
                                onTestContact={this.handleTestContact}
                                onAddContact={this.handleAddContact}
                                onUpdateContact={this.handleUpdateContact}
                                onRemoveContact={this.handleRemoveContact}
                            />
                        </div>
                    )}
                    {settings != null &&
                        tags != null &&
                        settings.subscriptions != null &&
                        settings.contacts != null &&
                        settings.contacts.length > 0 && (
                            <SubscriptionList
                                tags={tags}
                                contacts={settings.contacts}
                                subscriptions={settings.subscriptions}
                                onTestSubscription={this.handleTestSubscription}
                                onAddSubscription={this.handleAddSubscription}
                                onRemoveSubscription={this.handleRemoveSubscription}
                                onUpdateSubscription={this.handleUpdateSubscription}
                            />
                        )}
                </LayoutContent>
            </Layout>
        );
    }

    handleTestContact = async (contact: Contact) => {
        const { moiraApi } = this.props;
        try {
            await moiraApi.testContact(contact.id);
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    handleTestSubscription = async (subscription: Subscription) => {
        const { moiraApi } = this.props;
        try {
            await moiraApi.testSubscription(subscription.id);
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    handleAddContact = async (contact: $Shape<Contact>): Promise<?Contact> => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        const contactType = contact.type;

        if (settings == null || contactType == null) {
            throw new Error("InvalidProgramState");
        }

        try {
            let newContact = await moiraApi.addContact({
                value: SettingsContainer.normalizeContactValueForApi(contactType, contact.value),
                type: contactType,
                user: settings.login,
            });
            newContact = {
                ...newContact,
                value: SettingsContainer.normalizeContactValueForUi(
                    newContact.type,
                    newContact.value
                ),
            };
            this.setState({
                settings: {
                    ...settings,
                    contacts: [...settings.contacts, newContact],
                },
            });
            return newContact;
        } catch (error) {
            this.setState({ error: error.message });
            return null;
        }
    };

    handleUpdateContact = async (contact: Contact) => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        if (settings == null) {
            throw new Error("InvalidProgramState");
        }
        const { contacts } = settings;
        try {
            await moiraApi.updateContact({
                ...contact,
                value: SettingsContainer.normalizeContactValueForApi(contact.type, contact.value),
            });
            const index = contacts.findIndex(x => x.id === contact.id);
            this.setState({
                settings: {
                    ...settings,
                    contacts: [...contacts.slice(0, index), contact, ...contacts.slice(index + 1)],
                },
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    handleAddSubscription = async (subscription: SubscriptionInfo): Promise<?Subscription> => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        if (settings == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            const newSubscriptions = await moiraApi.addSubscription({
                ...subscription,
                user: settings.login,
            });
            this.setState({
                settings: {
                    ...settings,
                    subscriptions: [...settings.subscriptions, newSubscriptions],
                },
            });
            return newSubscriptions;
        } catch (error) {
            this.setState({ error: error.message });
            return null;
        }
    };

    handleUpdateSubscription = async (subscription: Subscription) => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        if (settings == null) {
            throw new Error("InvalidProgramState");
        }
        const { subscriptions } = settings;
        try {
            await moiraApi.updateSubscription(subscription);
            const index = subscriptions.findIndex(x => x.id === subscription.id);
            this.setState({
                settings: {
                    ...settings,
                    subscriptions: [
                        ...subscriptions.slice(0, index),
                        subscription,
                        ...subscriptions.slice(index + 1),
                    ],
                },
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    handleRemoveSubscription = async (subscription: Subscription) => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        if (settings == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await moiraApi.delSubscription(subscription.id);
            this.setState({
                settings: {
                    ...settings,
                    subscriptions: settings.subscriptions.filter(x => x.id !== subscription.id),
                },
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    handleRemoveContact = async (contact: Contact) => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        if (settings == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await moiraApi.deleteContact(contact.id);
            this.setState({
                settings: {
                    ...settings,
                    contacts: settings.contacts.filter(x => x.id !== contact.id),
                },
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    async getData() {
        const { moiraApi } = this.props;
        try {
            const tags = (await moiraApi.getTagList()).list;
            let settings = await moiraApi.getSettings();
            const config = await moiraApi.getConfig();
            settings = {
                ...settings,
                contacts: settings.contacts.map(x => ({
                    ...x,
                    value: SettingsContainer.normalizeContactValueForUi(x.type, x.value),
                })),
            };
            this.setState({ settings, config, tags });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(SettingsContainer);
