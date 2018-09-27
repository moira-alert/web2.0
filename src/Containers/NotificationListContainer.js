// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { Notification } from "../Domain/Notification";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import NotificationList from "../Components/NotificationList/NotificationList";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { MoiraStates, MoiraStatus } from "../Domain/MoiraStatus";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<Notification>,
    total: ?number,
    notifier_state: MoiraStatus,
};

class NotificationListContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
        total: null,
        notifier_state: { state: MoiraStates.OK },
    };

    componentDidMount() {
        this.getData(this.props);
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi } = props;
        try {
            const notifications = await moiraApi.getNotificationList();
            const notifierState = await moiraApi.getMoiraStatus();
            this.setState({ loading: false, notifier_state: notifierState, ...notifications });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    composeNotifications(items: Array<Notification>): { [id: string]: Notification } {
        return items.reduce((data, item) => {
            const id: string = item.timestamp + item.contact.id + item.event.sub_id;
            if (!data[id]) {
                data[id] = item;
            }
            return data;
        }, {});
    }

    async removeNotification(id: string): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delNotification(id);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async removeAllNotifications(): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delAllNotifications();
            await this.props.moiraApi.delAllNotificationEvents();
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async updateMoiraState(state: string): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.setMoiraStatus({ state: state });
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render(): React.Node {
        const { loading, error, list, notifier_state } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Notifications</LayoutTitle>
                    {list && (
                        <NotificationList
                            items={this.composeNotifications(list)}
                            onRemove={id => {
                                this.removeNotification(id);
                            }}
                            onRemoveAll={() => {
                                this.removeAllNotifications();
                            }}
                            onChangeNotifierState={state => {
                                this.updateMoiraState(state);
                            }}
                            notifier_state={notifier_state}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(NotificationListContainer);
