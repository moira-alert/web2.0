import React, { FC, useEffect } from "react";
import { Select } from "@skbkontur/react-ui/components/Select";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import ContactList from "../Components/ContactList/ContactList";
import { SubscriptionListContainer } from "./SubscriptionListContainer/SubscriptionListContainer";
import { Team } from "../Domain/Team";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { getPageLink } from "../Domain/Global";
import { Grid } from "../Components/Grid/Grid";
import { useLoadSettingsData } from "../hooks/useLoadSettingsData";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppSelector } from "../store/hooks";
import { ConfigState, UIState } from "../store/selectors";
import RouterLink from "../Components/RouterLink/RouterLink";
import { EUserRoles } from "../Domain/User";
import { RouteComponentProps } from "react-router";
import { MessageWrapper } from "../Components/MessageWrapper/MesaageWrapper";
import { Flexbox } from "../Components/Flexbox/FlexBox";

export interface ISettingsContainerProps extends RouteComponentProps {
    isTeamMember?: boolean;
}

const SettingsContainer: FC<ISettingsContainerProps> = ({ isTeamMember, history }) => {
    const { login, role, settings, tags, team, teams } = useLoadSettingsData(isTeamMember);
    const { config } = useAppSelector(ConfigState);
    const { isLoading, error } = useAppSelector(UIState);

    const userAsTeam = { id: "", name: login ?? "Unknown" };
    const userWithTeams = teams ? [userAsTeam, ...teams] : [];

    const handleChangeTeam = async (userOrTeam: Team) => {
        history.push(getPageLink("teamSettings", userOrTeam.id ?? undefined));
    };

    const isAdminLink = !isTeamMember && role === EUserRoles.Admin && team;

    useEffect(() => {
        setDocumentTitle("Settings");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <RowStack gap={1} block>
                    <LayoutTitle>Notifications</LayoutTitle>
                    <Fill />
                    <Grid columns={"max-content"} gap="4px">
                        <MessageWrapper
                            shouldApplyWrapper={isTeamMember === false}
                            message="This is not your team, be careful with actions"
                        >
                            Current User: {login}
                            <Flexbox align="baseline" direction="row" gap={4}>
                                <span>Shown for {team ? "team" : "user"}</span>
                                {isAdminLink ? (
                                    <RouterLink to={getPageLink("team", team.id)}>
                                        {team.name}
                                    </RouterLink>
                                ) : (
                                    <Select<Team>
                                        use={"link"}
                                        value={team ?? userAsTeam}
                                        items={userWithTeams}
                                        renderValue={(value) => value.name}
                                        renderItem={(value) => value.name}
                                        onValueChange={handleChangeTeam}
                                    />
                                )}
                            </Flexbox>
                        </MessageWrapper>
                    </Grid>
                </RowStack>
                {config && settings && (
                    <div style={{ marginBottom: 50 }}>
                        <ContactList
                            settings={settings}
                            contactDescriptions={config.contacts}
                            contacts={settings.contacts}
                        />
                    </div>
                )}
                {settings && tags && (
                    <SubscriptionListContainer
                        teams={teams}
                        tags={tags}
                        contacts={settings.contacts}
                        subscriptions={settings.subscriptions}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};
export default SettingsContainer;
