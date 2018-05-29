// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { Notification } from "../Domain/Notification";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import NotificationList from "../Components/NotificationList/NotificationList";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<Notification>,
    total: ?number,
};

class NotificationListContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
        total: null,
    };

    componentDidMount() {
        this.getData(this.props);
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi } = props;
        try {
            const notifications = await moiraApi.getNotificationList();
            this.setState({ loading: false, ...notifications });
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
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async removeNotificationsEvents(): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delAllNotificationEvents();
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render(): React.Node {
        const { loading, error, list } = this.state;
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
                            onRemoveEvents={() => {
                                this.removeNotificationsEvents();
                            }}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(NotificationListContainer);
