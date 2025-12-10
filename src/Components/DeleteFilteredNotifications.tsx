import React, { FC, useState } from "react";
import { getUnixTime } from "date-fns";
import { Flexbox } from "../Components/Flexbox/FlexBox";
import TagDropdownSelect from "../Components/TagDropdownSelect/TagDropdownSelect";
import { TimeRangeSelector } from "../Components/TriggerNoisiness/Components/TimeRangeSelector";
import { useDeleteFilteredNotificationsMutation } from "../services/NotificationsApi";
import { useGetTagsQuery } from "../services/TagsApi";
import { ClusterKeyDropdownSelect } from "./ClusterKeyDropdownSelect/СlusterKeyDropdownSelect";

interface IDeleteFilteredNotificationsProps {
    clusterKeys?: string[];
}

export const DeleteFilteredNotifications: FC<IDeleteFilteredNotificationsProps> = ({
    clusterKeys,
}) => {
    const [fromTime, setFromTime] = useState<Date | null>(null);
    const [untilTime, setUntilTime] = useState<Date | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedClusterKeys, setSelectedClusterKeys] = useState<string[]>([]);

    const { data: tags } = useGetTagsQuery();
    const [deleteFilteredNotifications] = useDeleteFilteredNotificationsMutation();

    const handleDelete = async () => {
        if (!fromTime || !untilTime) return;

        await deleteFilteredNotifications({
            start: getUnixTime(fromTime),
            end: getUnixTime(untilTime),
            ignoredTags: selectedTags,
            clusterKeys: selectedClusterKeys,
        });
    };

    const handleClusterToggle = (clusterKey: string, checked: boolean) => {
        setSelectedClusterKeys((prev) =>
            checked ? [...prev, clusterKey] : prev.filter((key) => key !== clusterKey)
        );
    };

    const handleAllClustersToggle = (checked: boolean) => {
        if (checked) {
            setSelectedClusterKeys([]);
        } else {
            setSelectedClusterKeys(clusterKeys ?? []);
        }
    };

    return (
        <Flexbox gap={12} direction="row">
            {tags && (
                <TagDropdownSelect
                    width={438}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    availableTags={tags}
                />
            )}
            <ClusterKeyDropdownSelect
                clusterKeys={clusterKeys}
                selectedClusterKeys={selectedClusterKeys}
                onToggleCluster={handleClusterToggle}
                onToggleAll={handleAllClustersToggle}
            />
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
