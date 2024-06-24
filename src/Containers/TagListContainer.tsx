import React, { useEffect, FC } from "react";
import { TagList } from "../Components/TagList/TagList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { UIState } from "../store/selectors";
import { useAppSelector } from "../store/hooks";
import { useGetAllContactsQuery } from "../services/ContactApi";
import { useGetTagStatsQuery } from "../services/TagsApi";

const TagListContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const { data: contacts } = useGetAllContactsQuery();
    const { data: tagStats } = useGetTagStatsQuery();

    useEffect(() => {
        setDocumentTitle("Tags");
    }, []);

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
