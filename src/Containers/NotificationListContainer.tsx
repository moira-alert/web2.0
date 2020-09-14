import * as React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Notification } from "../Domain/Notification";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import MoiraServiceStates from "../Domain/MoiraServiceStates";
import Layout, { LayoutContent, LayoutTitle, LayoutFooter } from "../Components/Layout/Layout";
import NotificationList from "../Components/NotificationList/NotificationList";
import ToggleWithLabel from "../Components/Toggle/Toggle";

type Props = { moiraApi: IMoiraApi };
type State = {
    loading: boolean;
    error?: string;
    list?: Array<Notification>;
    notifierEnabled: boolean;
};

class NotificationListContainer extends React.Component<Props, State> {
    state: State = {
        loading: true,
        notifierEnabled: true,
    };

    componentDidMount() {
        document.title = "Moira - Notifications";
        this.fetch(this.props);
    }

    static composeNotifications(items: Array<Notification>): { [id: string]: Array<Notification> } {
        return items.reduce((data: { [id: string]: Array<Notification> }, item: Notification) => {
            const id: string = item.timestamp + item.contact.id + item.event.sub_id;
            if (!data[id]) {
                data[id] = [];
            }
            data[id].push(item);
            return data;
        }, {});
    }

    render(): React.ReactElement {
        const { loading, error, list, notifierEnabled } = this.state;
        const layoutTitle = `Notifications ${Array.isArray(list) ? list.length : ""}`;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>{layoutTitle}</LayoutTitle>
                    {list && (
                        <NotificationList
                            items={NotificationListContainer.composeNotifications(list)}
                            onRemove={(id) => {
                                this.removeNotification(id);
                            }}
                        />
                    )}
                </LayoutContent>
                <LayoutFooter>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignContent: "center",
                        }}
                    >
                        <Button
                            icon={<TrashIcon />}
                            onClick={() => {
                                this.removeAllNotifications();
                            }}
                        >
                            Remove all notifications
                        </Button>
                        <ToggleWithLabel
                            label={
                                notifierEnabled ? "Notifications enabled" : "Notifications disabled"
                            }
                            checked={notifierEnabled}
                            onChange={(checked) => this.enableNotifier(checked)}
                        />
                    </div>
                </LayoutFooter>
            </Layout>
        );
    }

    async fetch(props: Props) {
        await this.getNotifications(props);
        await this.getNotifierState(props);
        this.setState({
            loading: false,
        });
    }

    async getNotifications(props: Props) {
        const { moiraApi } = props;
        try {
            const { list } = await moiraApi.getNotificationList();
            this.setState({ list });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async getNotifierState(props: Props) {
        const { moiraApi } = props;
        try {
            const notifier = await moiraApi.getNotifierState();
            this.setState({
                notifierEnabled: notifier?.state === MoiraServiceStates.OK,
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async removeNotification(id: string) {
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

    async removeAllNotifications() {
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

    async enableNotifier(enable: boolean) {
        const { moiraApi } = this.props;
        try {
            const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
            await moiraApi.setNotifierState({ state });
            this.getNotifierState(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }
}

export default withMoiraApi(NotificationListContainer);
