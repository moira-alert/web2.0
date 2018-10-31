// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { Notification } from "../Domain/Notification";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import NotificationList from "../Components/NotificationList/NotificationList";
import Layout, { LayoutContent, LayoutTitle, LayoutPaging } from "../Components/Layout/Layout";
import { MoiraServiceStates, NotifierState } from "../Domain/MoiraServiceStates";
import cn from "./NotificationListContainer.less";
import Button from "retail-ui/components/Button/Button";
import ToggleWithLabel from "../Components/Toggle/Toggle";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<Notification>,
    total: ?number,
    notifierServiceState: NotifierState,
};

class NotificationListContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
        total: null,
        notifierServiceState: { state: "ERROR" },
    };

    componentDidMount() {
        this.getData(this.props);
        this.getNotifierState(this.props);
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

    async getNotifierState(props: Props): Promise<void> {
        const { moiraApi } = props;
        try {
            const notifierState = await moiraApi.getMoiraStatus();
            this.setState({ notifierServiceState: notifierState });
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

    async updateNotifierState(state: string): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.setMoiraStatus({ state: state });
            this.getData(this.props);
            this.getNotifierState(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render(): React.Node {
        const { loading, error, list, notifierServiceState } = this.state;
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
                <LayoutPaging>
                    <div className={cn("actions-row")}>
                        <div className={cn("remove-notifications")}>
                            <Button icon="Trash" onClick={() => this.removeAllNotifications()}>
                                Remove all notifications
                            </Button>
                        </div>

                        <div className={cn("switch-notifier-state")}>
                            <ToggleWithLabel
                                label={
                                    notifierServiceState.state === MoiraServiceStates.OK
                                        ? "Notifications enabled"
                                        : "Notifications disabled"
                                }
                                checked={notifierServiceState.state === MoiraServiceStates.OK}
                                onChange={checked =>
                                    this.updateNotifierState(checked ? MoiraServiceStates.OK : MoiraServiceStates.ERROR)
                                }
                            />
                        </div>
                    </div>
                </LayoutPaging>
            </Layout>
        );
    }
}

export default withMoiraApi(NotificationListContainer);
