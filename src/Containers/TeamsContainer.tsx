import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Toast } from "@skbkontur/react-ui";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { Team } from "../Domain/Team";
import { Teams } from "../Components/Teams/Teams";

interface Props extends RouteComponentProps {
    moiraApi: MoiraApi;
}
type State = {
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
        const { loading, error, teams } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Teams</LayoutTitle>
                    <LayoutContent>
                        {teams ? (
                            <Teams
                                teams={teams}
                                addUserToTeam={this.addUser}
                                removeUser={this.removeUser}
                                addTeam={this.addTeam}
                                getUsers={this.getUsers}
                                updateTeam={this.updateTeam}
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
            console.error(error);
            Toast.push(error.message);
        }
    };

    private updateTeam = async (team: Team) => {
        try {
            await this.props.moiraApi.updateTeam(team);
            this.getData();
        } catch (error) {
            console.error(error);
            Toast.push(error.message);
        }
    };

    private getUsers = async (team: Team): Promise<string[]> => {
        try {
            const users = await this.props.moiraApi.getUsers(team.id);
            return users.usernames;
        } catch (error) {
            console.error(error);
            Toast.push(error.message);
            throw error;
        }
    };

    private addUser = async (team: Team, userName: string) => {
        try {
            return await this.props.moiraApi.addUser(team.id, userName);
        } catch (error) {
            console.error(error);
            Toast.push(error.message);
            throw error;
        }
    };

    private removeUser = async (team: Team, userName: string) => {
        try {
            await this.props.moiraApi.delUser(team.id, userName);
            this.getData();
        } catch (error) {
            console.error(error);
            Toast.push(error.message);
        }
    };

    private async getData() {
        try {
            const teams = await this.props.moiraApi.getTeams();
            this.setState({ teams: teams.teams });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(TeamsContainer);
