import React, { FC, useRef, useEffect } from "react";
import { Select } from "@skbkontur/react-ui/components/Select";
import MoiraApi from "../Api/MoiraApi";
import type { Contact } from "../Domain/Contact";
import type { Subscription } from "../Domain/Subscription";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import ContactList from "../Components/ContactList/ContactList";
import { SubscriptionListContainer } from "./SubscriptionListContainer/SubscriptionListContainer";
import { SubscriptionInfo } from "../Components/SubscriptionEditor/SubscriptionEditor";
import { Team } from "../Domain/Team";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Gapped } from "@skbkontur/react-ui";
import { RouteComponentProps } from "react-router";
import { getPageLink } from "../Domain/Global";
import { Grid } from "../Components/Grid/Grid";
import { ConfirmModal } from "../Components/ConfirmModal/ConfirmModal";
import { SubscriptionList } from "../Components/SubscriptionList/SubscriptionList";
import { useLoadSettingsData } from "../hooks/useLoadSettingsData";
import { setSettings, setDisruptedSubs } from "../store/Reducers/SettingsContainerReducer.slice";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ConfigState, SettingsState, UIState } from "../store/selectors";
import { toggleModal, setModalData } from "../store/Reducers/UIReducer.slice";
import { setError } from "../store/Reducers/UIReducer.slice";

export interface ISettingsContainerProps extends RouteComponentProps<{ teamId?: string }> {
    moiraApi: MoiraApi;
}

const SettingsContainer: FC<ISettingsContainerProps> = ({ moiraApi, match, history }) => {
    const teamId = match.params.teamId;
    const dispatch = useAppDispatch();
    const { loadData } = useLoadSettingsData(moiraApi, teamId);

    const { config } = useAppSelector(ConfigState);
    const { teamsAndTags, settings, disruptedSubs } = useAppSelector(SettingsState);
    const { isLoading, error } = useAppSelector(UIState);

    const { login, teams, tags, team } = teamsAndTags ?? {};

    const scrollRef = useRef<HTMLTableElement>(null);

    const isConfirmModalVisible = disruptedSubs?.length && settings;

    const user = { id: "", name: login ?? "Unknown" };
    const userWithTeams = teams ? [user, ...teams] : [];

    const normalizeContactValueForApi = (contactType: string, value: string): string => {
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
    };

    const onRemoveContactBtnClick = async (contact: Contact) => {
        if (settings === undefined) {
            throw new Error("InvalidProgramState");
        }

        const potentiallyDisruptedSubscriptions = settings.subscriptions.filter(
            (sub) => sub.contacts.length === 1 && sub.contacts.includes(contact.id)
        );

        if (potentiallyDisruptedSubscriptions.length) {
            dispatch(
                setModalData({
                    header:
                        "Can't delete this delivery channel. This will disrupt the functioning of the following subscriptions:",
                })
            );
            dispatch(toggleModal(true));
            dispatch(setDisruptedSubs(potentiallyDisruptedSubscriptions));
            return;
        }
        handleRemoveContact(contact);
    };

    const handleChangeTeam = async (userOrTeam: Team) => {
        history.push(getPageLink("settings", userOrTeam.id ?? undefined));
    };

    const handleAddContact = async (contact: Partial<Contact>): Promise<Contact | undefined> => {
        const contactType = contact.type;

        if (settings === undefined || contactType === undefined || login === undefined) {
            throw new Error("InvalidProgramState");
        }

        try {
            const requestContact = {
                value: normalizeContactValueForApi(contactType, contact.value ?? ""),
                type: contactType,
                user: team ? undefined : login,
            };

            const newContact = team
                ? await moiraApi.addTeamContact(requestContact, team)
                : await moiraApi.addContact(requestContact);
            dispatch(setSettings({ contacts: [...settings.contacts, newContact] }));

            return newContact;
        } catch (error) {
            dispatch(setError(error.message));
            return undefined;
        }
    };

    const handleUpdateContact = async (contact: Contact) => {
        if (settings === undefined) {
            throw new Error("InvalidProgramState");
        }
        const { contacts } = settings;
        try {
            await moiraApi.updateContact({
                ...contact,
                value: normalizeContactValueForApi(contact.type, contact.value),
            });
            const index = contacts.findIndex((x) => x.id === contact.id);
            dispatch(
                setSettings({
                    contacts: [...contacts.slice(0, index), contact, ...contacts.slice(index + 1)],
                })
            );
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    const handleAddSubscription = async (
        subscription: SubscriptionInfo
    ): Promise<Subscription | undefined> => {
        if (settings === undefined) {
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
            dispatch(setSettings({ subscriptions: [...settings.subscriptions, newSubscriptions] }));

            return newSubscriptions;
        } catch (error) {
            dispatch(setError(error.message));
            return undefined;
        }
    };

    const handleUpdateSubscription = async (subscription: Subscription) => {
        if (settings === undefined) {
            throw new Error("InvalidProgramState");
        }
        const { subscriptions } = settings;
        try {
            await moiraApi.updateSubscription(subscription);
            const index = subscriptions.findIndex((x) => x.id === subscription.id);
            dispatch(
                setSettings({
                    subscriptions: [
                        ...subscriptions.slice(0, index),
                        subscription,
                        ...subscriptions.slice(index + 1),
                    ],
                })
            );
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    const handleRemoveSubscription = async (subscription: Subscription) => {
        if (settings === undefined) {
            throw new Error("InvalidProgramState");
        }
        try {
            await moiraApi.delSubscription(subscription.id);
            dispatch(
                setSettings({
                    subscriptions: settings.subscriptions.filter((x) => x.id !== subscription.id),
                })
            );
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    const handleTestSubscription = async (subscription: Subscription) => {
        try {
            await moiraApi.testSubscription(subscription.id);
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    const handleTestContact = async (contact: Contact) => {
        try {
            await moiraApi.testContact(contact.id);
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    const handleRemoveContact = async (contact?: Contact) => {
        if (settings === undefined || !contact) {
            throw new Error("InvalidProgramState");
        }
        try {
            await moiraApi.deleteContact(contact.id);
            dispatch(
                setSettings({
                    contacts: settings.contacts.filter((x) => x.id !== contact.id),
                })
            );
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleModal(false));
        }
    };

    const scrollToElement = () => {
        dispatch(toggleModal(false));
        setTimeout(() => {
            const element = scrollRef.current as HTMLElement;
            const elementRect = element.getBoundingClientRect();
            window.scrollBy({ top: elementRect.bottom - window.innerHeight, behavior: "smooth" });
        }, 0);
    };

    useEffect(() => {
        loadData();
        setDocumentTitle("Settings");
    }, [teamId]);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                {isConfirmModalVisible && (
                    <ConfirmModal>
                        <SubscriptionList
                            handleEditSubscription={scrollToElement}
                            contacts={settings.contacts}
                            subscriptions={disruptedSubs}
                        />
                    </ConfirmModal>
                )}
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
                                onValueChange={handleChangeTeam}
                            />
                        </Gapped>
                    </Grid>
                </RowStack>
                {config && settings && (
                    <div style={{ marginBottom: 50 }}>
                        <ContactList
                            contactDescriptions={config.contacts}
                            items={settings.contacts}
                            onTestContact={handleTestContact}
                            onAddContact={handleAddContact}
                            onUpdateContact={handleUpdateContact}
                            onRemoveContact={onRemoveContactBtnClick}
                        />
                    </div>
                )}
                {settings && tags && (
                    <SubscriptionListContainer
                        tableRef={scrollRef}
                        tags={tags.list}
                        contacts={settings.contacts}
                        subscriptions={settings.subscriptions}
                        onTestSubscription={handleTestSubscription}
                        onAddSubscription={handleAddSubscription}
                        onRemoveSubscription={handleRemoveSubscription}
                        onUpdateSubscription={handleUpdateSubscription}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};
export default withMoiraApi(SettingsContainer);
