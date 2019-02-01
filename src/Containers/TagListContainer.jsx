// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
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

    async removeTag(tag: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delTag(tag);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    async removeContact(subscriptionId: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delSubscription(subscriptionId);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    async getData(props: Props) {
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
}

export default withMoiraApi(TagListContainer);
