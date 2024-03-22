import React, { useState, useEffect, FC } from "react";
import type { TagStat } from "../Domain/Tag";
import type { Contact } from "../Domain/Contact";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { TagList } from "../Components/TagList/TagList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import MoiraApi from "../Api/MoiraApi";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { Subscription } from "../Domain/Subscription";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { setError, toggleLoading } from "../store/Reducers/UIReducer.slice";

type TTagListContainerProps = { moiraApi: MoiraApi };

const TagListContainer: FC<TTagListContainerProps> = ({ moiraApi }) => {
    const [tagStats, setTagStats] = useState<Array<TagStat> | undefined>();
    const [contacts, setContacts] = useState<Array<Contact> | undefined>();

    const { error, isLoading } = useAppSelector(UIState);
    const dispatch = useAppDispatch();

    const getData = async (moiraApi: MoiraApi) => {
        dispatch(toggleLoading(true));
        try {
            const tagsResponse = await moiraApi.getTagStats();
            const contactsResponse = await moiraApi.getContactList();
            setTagStats(tagsResponse.list);
            setContacts(contactsResponse.list);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const handleRemoveTag = async (tag: string) => {
        dispatch(toggleLoading(true));
        try {
            await moiraApi.delTag(tag);
            getData(moiraApi);
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(toggleLoading(false));
        }
    };

    const handleUpdateSubscription = async (subscription: Subscription) => {
        dispatch(toggleLoading(true));
        try {
            await moiraApi.updateSubscription(subscription);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const handleRemoveSubscription = async (subscription: Subscription) => {
        dispatch(toggleLoading(true));
        try {
            await moiraApi.delSubscription(subscription.id);
            getData(moiraApi);
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(toggleLoading(false));
        }
    };

    const handleTestSubscription = async (subscription: Subscription) => {
        try {
            await moiraApi.testSubscription(subscription.id);
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    useEffect(() => {
        setDocumentTitle("Tags");
        getData(moiraApi);
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Tags: {tagStats?.length}</LayoutTitle>
                {tagStats && contacts && (
                    <TagList
                        items={tagStats}
                        contacts={contacts}
                        onRemoveTag={handleRemoveTag}
                        onUpdateSubscription={handleUpdateSubscription}
                        onTestSubscription={handleTestSubscription}
                        onRemoveSubscription={handleRemoveSubscription}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};

export default withMoiraApi(TagListContainer);
