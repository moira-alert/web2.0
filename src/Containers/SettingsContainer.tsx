import * as React from "react";
import { Select } from "@skbkontur/react-ui/components/Select";
import MoiraApi from "../Api/MoiraApi";
import type { Config } from "../Domain/Config";
import type { Settings } from "../Domain/Settings";
import type { Contact } from "../Domain/Contact";
import type { Subscription } from "../Domain/Subscription";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import ContactList from "../Components/ContactList/ContactList";
import SubscriptionList from "../Components/SubscriptionList/SubscriptionList";
import { SubscriptionInfo } from "../Components/SubscriptionEditor/SubscriptionEditor";
import { Team } from "../Domain/Team";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Gapped } from "@skbkontur/react-ui";
import { RouteComponentProps } from "react-router";
import { getPageLink } from "../Domain/Global";
import { Grid } from "../Components/Grid/Grid";

interface Props extends RouteComponentProps<{ teamId?: string }> {
    moiraApi: MoiraApi;
}

interface State {
    loading: boolean;
    error?: string;
    login?: string;
    settings?: Settings;
    config?: Config;
    tags?: Array<string>;
    team?: Team;
    teams?: Team[];
}

class SettingsContainer extends React.Component<Props, State> {
    private teamId = this.props.match.params.teamId;

    public state: State = {
        loading: true,
    };

    async componentDidMount() {
        document.title = "Moira - Settings";
        try {
            await this.getTeamsAndTags();
            if (this.teamId) {
                await this.getTeamData(this.teamId);
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
        const { loading, error, login, tags, settings, config, team, teams } = this.state;
        const user = login ? { id: "", name: login } : { id: "", name: "Unknown" };
        const userWithTeams = teams ? [user, ...teams] : [];
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <RowStack gap={1} block>
                        <LayoutTitle>Notifications</LayoutTitle>
                        <Fill />
                        <Grid columns={"max-content"} gap="4px">
                            Current User: {login}
                            <Gapped gap={4}>
                                <span>Show for {team ? "team" : "user"}</span>
                                <Select<Team>
                                    use={"link"}
                                    value={team ?? user}
                                    items={userWithTeams}
                                    renderValue={(value) => value.name}
                                    renderItem={(value) => value.name}
                                    onValueChange={this.handleChangeTeam}
                                />
                            </Gapped>
                        </Grid>
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
        const { settings, team, login } = this.state;
        const contactType = contact.type;

        if (settings == undefined || contactType == undefined || login == undefined) {
            throw new Error("InvalidProgramState");
        }

        try {
            const requestContact = {
                value: SettingsContainer.normalizeContactValueForApi(
                    contactType,
                    contact.value ?? ""
                ),
                type: contactType,
                user: team ? undefined : login,
            };

            const newContact = team
                ? await moiraApi.addTeamContact(requestContact, team)
                : await moiraApi.addContact(requestContact);

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
        const { settings, team } = this.state;
        if (settings == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            const requestSubscription = {
                ...subscription,
                user: team ? undefined : settings.login,
            };

            const newSubscriptions = team
                ? await moiraApi.addTeamSubscription(requestSubscription, team)
                : await moiraApi.addSubscription(requestSubscription);
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

    private handleChangeTeam = async (userOrTeam: Team) => {
        try {
            if (userOrTeam.id) {
                this.setState({ loading: true, team: userOrTeam });
                await this.getTeamData(userOrTeam.id);
                this.props.history.replace(getPageLink("settings", userOrTeam.id));
            } else {
                this.setState({ loading: true, team: undefined });
                await this.getUserData();
                this.props.history.replace(getPageLink("settings"));
            }
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    private async getTeamsAndTags() {
        const [user, teams, tags, config] = await Promise.all([
            this.props.moiraApi.getUser(),
            this.props.moiraApi.getTeams(),
            this.props.moiraApi.getTagList(),
            this.props.moiraApi.getConfig(),
        ]);

        let team;

        if (this.props.match.params.teamId) {
            team = teams.teams.find(
                (teamOverview) => teamOverview.id === this.props.match.params.teamId
            );
        }

        this.setState({
            login: user.login,
            teams: teams.teams,
            tags: tags.list,
            config: config,
            team: team,
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
