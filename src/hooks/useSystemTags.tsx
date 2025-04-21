import { useMemo } from "react";
import { useGetSystemTagsQuery } from "../services/TagsApi";

export const useHasSystemTags = (
    tags: string[]
): { hasSystemTags: boolean; systemTags: string[] } => {
    const { data: systemTags = [] } = useGetSystemTagsQuery({ handleLoadingLocally: true });

    const hasSystemTags = useMemo(() => {
        return tags.some((tag) => systemTags.includes(tag));
    }, [tags, systemTags]);

    return { systemTags, hasSystemTags };
};
