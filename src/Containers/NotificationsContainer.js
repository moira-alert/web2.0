// @flow
import React from 'react';
import { uniq } from 'lodash';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Notification } from '../Domain/Notification';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import NotificationList from '../Components/NotificationList/NotificationList';
import Layout from '../Components/Layout/Layout';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    list: ?Array<Notification>;
    total: ?number;
|};

class NotificationsContainer extends React.Component {
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
        }
        catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    composeNotifications(items: Array<Notification>): { [id: string]: Notification } {
        return items.reduce((data, item) => {
            const id = item.timestamp + item.contact.id + item.event.sub_id;
            if (!data[id]) {
                data[id] = item;
            }
            return data;
        }, {});
    }

    async removeNotification(id: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.deltNotification(id);
        this.getData(this.props);
    }

    render(): React.Element<*> {
        const { loading, error, list } = this.state;
        return (
            <Layout loading={loading} error={error}>
                {list && (
                    <Layout.Content>
                        <NotificationList
                            items={this.composeNotifications(list)}
                            onRemove={id => {
                                this.removeNotification(id);
                            }}
                        />
                    </Layout.Content>
                )}
            </Layout>
        );
    }
}

export default withMoiraApi(NotificationsContainer);
