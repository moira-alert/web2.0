import React, { useEffect, FC } from "react";
import { TagList } from "../Components/TagList/TagList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { UIState } from "../store/selectors";
import { useLoadTagStatsData } from "../hooks/useLoadTagStatsData";
import { useAppSelector } from "../store/hooks";

const TagListContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const { contacts, tagStats } = useLoadTagStatsData();

    useEffect(() => {
        setDocumentTitle("Tags");
    }, [error, isLoading]);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Tags: {tagStats?.length}</LayoutTitle>
                {tagStats && contacts && <TagList contacts={contacts} items={tagStats} />}
            </LayoutContent>
        </Layout>
    );
};

export default TagListContainer;
