import React, { useEffect, FC } from "react";
import { TagList } from "../Components/TagList/TagList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { Subscription } from "../Domain/Subscription";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { setError, toggleLoading } from "../store/Reducers/UIReducer.slice";
import { useDeleteSubscriptionMutation } from "../services/SubscriptionsApi";
import { useDeleteTagMutation } from "../services/TagsApi";
import { useLoadTagStatsData } from "../hooks/useLoadTagStatsData";

const TagListContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const [deleteSubscription] = useDeleteSubscriptionMutation();
    const [deleteTag] = useDeleteTagMutation();
    const { contacts, tagStats } = useLoadTagStatsData();
    const dispatch = useAppDispatch();

    const handleRemoveTag = async (tag: string) => {
        dispatch(toggleLoading(true));
        try {
            await deleteTag(tag).unwrap();
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const handleRemoveSubscription = async (subscription: Subscription) => {
        dispatch(toggleLoading(true));
        try {
            await deleteSubscription({ id: subscription.id }).unwrap();
        } catch (error) {
            dispatch(setError(error));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    useEffect(() => {
        setDocumentTitle("Tags");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Tags: {tagStats?.length}</LayoutTitle>
                {tagStats && contacts && (
                    <TagList
                        contacts={contacts}
                        items={tagStats}
                        onRemoveTag={handleRemoveTag}
                        onRemoveSubscription={handleRemoveSubscription}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};

export default TagListContainer;
