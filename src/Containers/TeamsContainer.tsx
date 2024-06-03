import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { Toast } from "@skbkontur/react-ui";
import MoiraApi, { ApiError } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { Team } from "../Domain/Team";
import { Teams } from "../Components/Teams/Teams";
import { setDocumentTitle } from "../helpers/setDocumentTitle";

interface Props extends RouteComponentProps {
    moiraApi: MoiraApi;
}

const TeamsContainer = ({ moiraApi }: Props) => {
    const [teams, setTeams] = useState<Team[] | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>();

    const getData = async () => {
        try {
            setLoading(true);
            const teams = await moiraApi.getTeams();
            setTeams(teams.teams);
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const addTeam = async (team: Partial<Team>) => {
        try {
            setLoading(true);
            await moiraApi.addTeam(team);
            getData();
        } catch (error) {
            setErrorMessage(error);
        }
    };

    const updateTeam = async (team: Team) => {
        try {
            setLoading(true);
            await moiraApi.updateTeam(team);
            getData();
        } catch (error) {
            setErrorMessage(error);
        }
    };

    const deleteTeam = async (team: Team) => {
        try {
            setLoading(true);
            await moiraApi.delTeam(team.id);
            getData();
        } catch (error) {
            setErrorMessage(error);
        }
    };

    const getUsers = async (team: Team): Promise<string[]> => {
        try {
            setLoading(true);
            const users = await moiraApi.getUsers(team.id);
            return users.usernames;
        } catch (error) {
            setErrorMessage(error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (team: Team, userName: string) => {
        try {
            setLoading(true);
            return await moiraApi.addUser(team.id, userName);
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const removeUser = async (team: Team, userName: string) => {
        try {
            setLoading(true);
            await moiraApi.delUser(team.id, userName);
        } catch (error) {
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    const setErrorMessage = (error: ApiError) => {
        console.error(error);
        if (error.status >= 400 && error.status < 500) {
            Toast.push(error.message);
        } else {
            setError(error.message);
        }
    };

    useEffect(() => {
        getData();
        setDocumentTitle("Teams");
    }, []);

    return (
        <Layout loading={loading} error={error}>
            <LayoutContent>
                <LayoutTitle>Teams</LayoutTitle>
                <LayoutContent>
                    {teams ? (
                        <Teams
                            teams={teams}
                            addUserToTeam={addUser}
                            removeUser={removeUser}
                            addTeam={addTeam}
                            getUsers={getUsers}
                            updateTeam={updateTeam}
                            deleteTeam={deleteTeam}
                        />
                    ) : null}
                </LayoutContent>
            </LayoutContent>
        </Layout>
    );
};

export default withMoiraApi(TeamsContainer);
