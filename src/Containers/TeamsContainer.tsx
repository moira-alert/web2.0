import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Toast } from "@skbkontur/react-ui";
import MoiraApi, { ApiError } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { Team } from "../Domain/Team";
import { Teams } from "../Components/Teams/Teams";

interface Props extends RouteComponentProps {
    moiraApi: MoiraApi;
}
type State = {
    login?: string;
    teams?: Team[];
    loading: boolean;
    error?: string;
};

class TeamsContainer extends React.Component<Props, State> {
    public state: State = {
        loading: true,
    };

    public componentDidMount() {
        document.title = "Moira - Teams";
        this.getData();
    }

    public render(): React.ReactElement {
        const { loading, error, teams, login } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Teams</LayoutTitle>
                    <LayoutContent>
                        {teams ? (
                            <Teams
                                login={login}
                                teams={teams}
                                addUserToTeam={this.addUser}
                                removeUser={this.removeUser}
                                addTeam={this.addTeam}
                                getUsers={this.getUsers}
                                updateTeam={this.updateTeam}
                                deleteTeam={this.deleteTeam}
                            />
                        ) : null}
                    </LayoutContent>
                </LayoutContent>
            </Layout>
        );
    }

    private addTeam = async (team: Partial<Team>) => {
        try {
            await this.props.moiraApi.addTeam(team);
            this.getData();
        } catch (error) {
            this.setError(error);
        }
    };

    private updateTeam = async (team: Team) => {
        try {
            await this.props.moiraApi.updateTeam(team);
            this.getData();
        } catch (error) {
            this.setError(error);
        }
    };

    private deleteTeam = async (team: Team) => {
        try {
            await this.props.moiraApi.delTeam(team.id);
            this.getData();
        } catch (error) {
            this.setError(error);
        }
    };

    private getUsers = async (team: Team): Promise<string[]> => {
        try {
            const users = await this.props.moiraApi.getUsers(team.id);
            return users.usernames;
        } catch (error) {
            this.setError(error);
            throw error;
        }
    };

    private addUser = async (team: Team, userName: string) => {
        try {
            return await this.props.moiraApi.addUser(team.id, userName);
        } catch (error) {
            this.setError(error);
            throw error;
        }
    };

    private removeUser = async (team: Team, userName: string) => {
        try {
            await this.props.moiraApi.delUser(team.id, userName);
        } catch (error) {
            this.setError(error);
        }
    };

    private async getData() {
        try {
            const { login } = await this.props.moiraApi.getUser();
            const teams = await this.props.moiraApi.getTeams();
            this.setState({ teams: teams.teams, login: login });
        } catch (error) {
            this.setError(error);
        } finally {
            this.setState({ loading: false });
        }
    }

    private setError = (error: ApiError) => {
        console.error(error);
        if (error.status >= 400 && error.status < 500) {
            Toast.push(error.message);
        } else {
            this.setState({ error: error.message });
        }
    };
}

export default withMoiraApi(TeamsContainer);
