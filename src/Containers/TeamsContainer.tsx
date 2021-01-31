import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Toast } from "@skbkontur/react-ui";
import { IMoiraApi } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { Team } from "../Domain/Team";
import { Teams } from "../Components/Teams/Teams";
import { User } from "../Domain/User";

interface Props extends RouteComponentProps {
    moiraApi: IMoiraApi;
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
                                addUser={this.addUser}
                                removeUser={this.removeUser}
                                addTeam={this.addTeam}
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

    private addUser = async (team: Team, user: Partial<User>) => {
        try {
            await this.props.moiraApi.addUser(team.id, user);
            this.getData();
        } catch (error) {
            console.error(error);
            Toast.push(error.message);
        }
    };

    private removeUser = async (team: Team, user: User) => {
        try {
            await this.props.moiraApi.delUser(team.id, user.id);
            this.getData();
        } catch (error) {
            console.error(error);
            Toast.push(error.message);
        }
    };

    private async getData() {
        try {
            const teams = await this.props.moiraApi.getTeams();
            this.setState({ teams: teams });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(TeamsContainer);
