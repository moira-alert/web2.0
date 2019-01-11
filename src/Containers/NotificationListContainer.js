// @flow
import * as React from "react";
import Button from "retail-ui/components/Button/Button";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { Notification } from "../Domain/Notification";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { MoiraServiceStates } from "../Domain/MoiraServiceStates";
import TrashIcon from "@skbkontur/react-icons/Trash";
import Layout, { LayoutContent, LayoutTitle, LayoutFooter } from "../Components/Layout/Layout";
import NotificationList from "../Components/NotificationList/NotificationList";
import ToggleWithLabel from "../Components/Toggle/Toggle";
import cn from "./NotificationListContainer.less";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<Notification>,
    total: ?number,
    notifierEnabled: boolean,
};

class NotificationListContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
        total: null,
        notifierEnabled: true,
    };

    componentDidMount() {
        this.fetch(this.props);
    }

    async fetch(props: Props): Promise<void> {
        await this.getNotifications(props);
        await this.getNotifierState(props);
        this.setState({
            loading: false,
        });
    }

    async getNotifications(props: Props): Promise<void> {
        const { moiraApi } = props;
        try {
            const notifications = await moiraApi.getNotificationList();
            this.setState({ ...notifications });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async getNotifierState(props: Props): Promise<void> {
        const { moiraApi } = props;
        try {
            const notifier = await moiraApi.getNotifierState();
            this.setState({ notifierEnabled: notifier && notifier.state === MoiraServiceStates.OK });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async removeNotification(id: string): Promise<void> {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delNotification(id);
            this.getNotifications(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    async removeAllNotifications(): Promise<void> {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delAllNotificationEvents();
            await moiraApi.delAllNotifications();
            this.getNotifications(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    async enableNotifier(enable: boolean): Promise<void> {
        const { moiraApi } = this.props;
        try {
            const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
            await moiraApi.setNotifierState({ state: state });
            this.getNotifierState(this.props);
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

    render(): React.Node {
        const { loading, error, list, notifierEnabled } = this.state;
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
                        />
                    )}
                </LayoutContent>
                <LayoutFooter>
                    <div className={cn("actions-row")}>
                        <Button icon={<TrashIcon />} onClick={() => this.removeAllNotifications()}>
                            Remove all notifications
                        </Button>
                        <ToggleWithLabel
                            label={notifierEnabled ? "Notifications enabled" : "Notifications disabled"}
                            checked={notifierEnabled}
                            onChange={checked => this.enableNotifier(checked)}
                        />
                    </div>
                </LayoutFooter>
            </Layout>
        );
    }
}

export default withMoiraApi(NotificationListContainer);
