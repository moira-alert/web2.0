import * as React from "react";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { TagStat } from "../Domain/Tag";
import type { Contact } from "../Domain/Contact";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import TagList from "../Components/TagList/TagList";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = { moiraApi: IMoiraApi };
type State = {
    loading: boolean;
    error?: string;
    tags?: Array<TagStat>;
    contacts?: Array<Contact>;
};

class TagListContainer extends React.Component<Props, State> {
    public state: State = {
        loading: true,
    };

    public componentDidMount() {
        document.title = "Moira - Tags";
        this.getData(this.props);
    }

    public render(): React.ReactElement {
        const { loading, error, tags, contacts } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Tags</LayoutTitle>
                    {tags && contacts && (
                        <TagList
                            items={tags}
                            contacts={contacts}
                            onRemove={this.removeTag}
                            onRemoveContact={this.removeContact}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }

    private removeTag = async (tag: string) => {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delTag(tag);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    private removeContact = async (subscriptionId: string) => {
        this.setState({ loading: true });
        try {
            await this.props.moiraApi.delSubscription(subscriptionId);
            this.getData(this.props);
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    private async getData(props: Props) {
        try {
            const tags = await props.moiraApi.getTagStats();
            const contacts = await props.moiraApi.getContactList();
            this.setState({ tags: tags.list, contacts: contacts.list });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(TagListContainer);
