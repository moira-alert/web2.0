import React, { FC, useState } from "react";
import { getUnixTime } from "date-fns";
import { Flexbox } from "../Components/Flexbox/FlexBox";
import TagDropdownSelect from "../Components/TagDropdownSelect/TagDropdownSelect";
import { TimeRangeSelector } from "../Components/TriggerNoisiness/Components/TimeRangeSelector";
import { useDeleteFilteredNotificationsMutation } from "../services/NotificationsApi";
import { useGetTagsQuery } from "../services/TagsApi";

export const DeleteFilteredNotifications: FC = () => {
    const [fromTime, setFromTime] = useState<Date | null>(null);
    const [untilTime, setUntilTime] = useState<Date | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { data: tags } = useGetTagsQuery();
    const [deleteFilteredNotifications] = useDeleteFilteredNotificationsMutation();

    const handleDelete = async () => {
        if (!fromTime || !untilTime) return;

        await deleteFilteredNotifications({
            start: getUnixTime(fromTime),
            end: getUnixTime(untilTime),
            tags: selectedTags,
        });
    };

    return (
        <Flexbox gap={12} direction="row">
            {tags && (
                <TagDropdownSelect
                    value={selectedTags}
                    onChange={setSelectedTags}
                    availableTags={tags}
                />
            )}
            <TimeRangeSelector
                fromTime={fromTime}
                untilTime={untilTime}
                setFromTime={setFromTime}
                setUntilTime={setUntilTime}
                onApply={handleDelete}
                buttonText="Delete Notifications"
            />
        </Flexbox>
    );
};
