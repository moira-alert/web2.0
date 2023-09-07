import * as React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import TrashIcon from "@skbkontur/react-icons/Trash";
import MoiraApi from "../Api/MoiraApi";
import type { Notification } from "../Domain/Notification";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import MoiraServiceStates from "../Domain/MoiraServiceStates";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import NotificationList from "../Components/NotificationList/NotificationList";
import { ConfirmDeleteModal } from "../Components/ConfirmDeleteModal/ConfirmDeleteModal";

type Props = { moiraApi: MoiraApi };
type State = {
    loading: boolean;
    error?: string;
    list?: Array<Notification>;
    notifierEnabled: boolean;
    showConfirmModal: boolean;
};

class NotificationListContainer extends React.Component<Props, State> {
    state: State = {
        loading: true,
        notifierEnabled: true,
        showConfirmModal: false,
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
        const notificationAmount = Array.isArray(list) ? list.length : "";
        const layoutTitle = `Notifications ${notificationAmount}`;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>{layoutTitle}</LayoutTitle>
                    {this.state.showConfirmModal && (
                        <ConfirmDeleteModal
                            message={`Are you sure with deleting all ${notificationAmount}  notifications?`}
                            onClose={() => this.setState({ showConfirmModal: false })}
                            onDelete={this.removeAllNotifications}
                        />
                    )}
                    <Gapped gap={30}>
                        <Toggle checked={notifierEnabled} onValueChange={this.enableNotifier}>
                            Notifications
                        </Toggle>
                        <Button
                            use={"link"}
                            icon={<TrashIcon />}
                            onClick={() => this.setState({ showConfirmModal: true })}
                        >
                            Remove all
                        </Button>
                    </Gapped>
                    <br />
                    {list && (
                        <NotificationList
                            items={NotificationListContainer.composeNotifications(list)}
                            onRemove={this.removeNotification}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }

    async fetch(props: Props) {
        await this.getNotifications(props);
        await this.getNotifierState(props);

        this.setState({ loading: false });
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

    removeNotification = async (id: string) => {
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
    };

    removeAllNotifications = async () => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delAllNotificationEvents();
            await moiraApi.delAllNotifications();
            this.getNotifications(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false, showConfirmModal: false });
        }
    };

    enableNotifier = async (enable: boolean) => {
        const { moiraApi } = this.props;
        try {
            const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
            await moiraApi.setNotifierState({ state });
            this.getNotifierState(this.props);
        } catch (error) {
            this.setState({ error: error.message });
        }
    };
}

export default withMoiraApi(NotificationListContainer);
