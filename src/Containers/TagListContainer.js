// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { TagStat } from "../Domain/Tag";
import type { Contact } from "../Domain/Contact";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import TagList from "../Components/TagList/TagList";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    tags: ?Array<TagStat>,
    contacts: ?Array<Contact>,
};

class TagListContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        tags: null,
        contacts: null,
    };

    componentDidMount() {
        this.getData(this.props);
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi } = props;
        try {
            const tags = await moiraApi.getTagStats();
            const contacts = await moiraApi.getContactList();
            this.setState({ tags: tags.list, contacts: contacts.list });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    async removeTag(tag: string): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delTag(tag);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    async removeContact(subscriptionId: string): Promise<void> {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delSubscription(subscriptionId);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    render(): React.Node {
        const { loading, error, tags, contacts } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Tags</LayoutTitle>
                    {tags && contacts && (
                        <TagList
                            items={tags}
                            contacts={contacts}
                            onRemove={tag => {
                                this.removeTag(tag);
                            }}
                            onRemoveContact={subscriptionId => {
                                this.removeContact(subscriptionId);
                            }}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(TagListContainer);
