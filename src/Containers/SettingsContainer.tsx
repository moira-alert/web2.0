import * as React from "react";
import { Select } from "@skbkontur/react-ui/components/Select";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Config } from "../Domain/Config";
import type { Settings } from "../Domain/Settings";
import type { Contact } from "../Domain/Contact";
import type { Subscription } from "../Domain/Subscription";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import ContactList from "../Components/ContactList/ContactList";
import SubscriptionList from "../Components/SubscriptionList/SubscriptionList";
import { SubscriptionInfo } from "../Components/SubscriptionEditor/SubscriptionEditor";
import { TeamOverview } from "../Domain/Team";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Gapped } from "@skbkontur/react-ui";
import { RouteComponentProps } from "react-router";
import { getPageLink } from "../Domain/Global";

const User = { id: "user", name: "User" };

interface Props extends RouteComponentProps<{ teamId?: string }> {
    moiraApi: IMoiraApi;
}

interface State {
    loading: boolean;
    error?: string;
    settings?: Settings;
    config?: Config;
    tags?: Array<string>;
    userOrTeam?: TeamOverview;
    userWithTeams?: TeamOverview[];
}

class SettingsContainer extends React.Component<Props, State> {
    public state: State = {
        loading: true,
        userOrTeam: User,
    };

    async componentDidMount() {
        document.title = "Moira - Settings";
        try {
            await this.getTeamsAndTags();
            if (this.props.match.params.teamId) {
                await this.getTeamData(this.props.match.params.teamId);
            } else {
                await this.getUserData();
            }
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
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

    render(): React.ReactElement {
        const { loading, error, tags, settings, config, userOrTeam, userWithTeams } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <RowStack gap={1} block>
                        <LayoutTitle>Notifications</LayoutTitle>
                        <Fill />
                        <Gapped gap={4}>
                            <span>Show for</span>
                            <Select<TeamOverview>
                                use={"link"}
                                value={userOrTeam}
                                items={userWithTeams ?? []}
                                renderValue={(value) => value.name}
                                renderItem={(value) => value.name}
                                onValueChange={this.handleChangeTeam}
                            />
                        </Gapped>
                    </RowStack>
                    {config != undefined && settings?.contacts != undefined && (
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
                    {settings != undefined &&
                        tags != undefined &&
                        settings.subscriptions != undefined &&
                        settings?.contacts.length > 0 && (
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
        try {
            await this.props.moiraApi.testContact(contact.id);
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

    handleAddContact = async (contact: Partial<Contact>): Promise<Contact | undefined> => {
        const { moiraApi } = this.props;
        const { settings } = this.state;
        const contactType = contact.type;

        if (settings == undefined || contactType == undefined) {
            throw new Error("InvalidProgramState");
        }

        try {
            const newContact = await moiraApi.addContact({
                value: SettingsContainer.normalizeContactValueForApi(
                    contactType,
                    contact.value ?? ""
                ),
                type: contactType,
                user: settings.login,
            });

            this.setState({
                settings: {
                    ...settings,
                    contacts: [...settings.contacts, newContact],
                },
            });
            return newContact;
        } catch (error) {
            this.setState({ error: error.message });
            return undefined;
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
            const index = contacts.findIndex((x) => x.id === contact.id);
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

    handleAddSubscription = async (
        subscription: SubscriptionInfo
    ): Promise<Subscription | undefined> => {
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
            return undefined;
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
            const index = subscriptions.findIndex((x) => x.id === subscription.id);
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
                    subscriptions: settings.subscriptions.filter((x) => x.id !== subscription.id),
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
                    contacts: settings.contacts.filter((x) => x.id !== contact.id),
                },
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    private handleChangeTeam = async (userOrTeam: TeamOverview) => {
        try {
            this.setState({ userOrTeam, loading: true });
            if (userOrTeam.id === User.id) {
                await this.getUserData();
                this.props.history.replace(getPageLink("settings"));
            } else {
                await this.getTeamData(userOrTeam.id);
                this.props.history.replace(getPageLink("settings", userOrTeam.id));
            }
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    private async getTeamsAndTags() {
        const teams = await this.props.moiraApi.getTeamsList();
        const tags = (await this.props.moiraApi.getTagList()).list;
        const config = await this.props.moiraApi.getConfig();
        let teamOrUser = User;

        if (this.props.match.params.teamId) {
            const team = teams.find(
                (teamOverview) => teamOverview.id === this.props.match.params.teamId
            );
            if (team) {
                teamOrUser = team;
            }
        }

        this.setState({
            userWithTeams: [User, ...teams],
            tags: tags,
            config: config,
            userOrTeam: teamOrUser,
        });
    }

    private async getUserData() {
        const settings = await this.props.moiraApi.getSettings();

        this.setState({ settings });
    }

    private async getTeamData(teamId: string) {
        const settings = await this.props.moiraApi.getSettingsByTeam(teamId);

        this.setState({ settings });
    }
}

export default withMoiraApi(SettingsContainer);
