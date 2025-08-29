import React, { FC, useState } from "react";
import { getUnixTime } from "date-fns";
import { Flexbox } from "../Components/Flexbox/FlexBox";
import TagDropdownSelect from "../Components/TagDropdownSelect/TagDropdownSelect";
import { TimeRangeSelector } from "../Components/TriggerNoisiness/Components/TimeRangeSelector";
import { useDeleteFilteredNotificationsMutation } from "../services/NotificationsApi";
import { useGetTagsQuery } from "../services/TagsApi";
import { DropdownMenu } from "@skbkontur/react-ui";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Button } from "@skbkontur/react-ui/components/Button";
import Filter from "@skbkontur/react-icons/Filter";
import ArrowChevronDown from "@skbkontur/react-icons/ArrowChevronDown";

import styles from "~styles/utils.module.less";

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

    return (
        <Flexbox gap={12} direction="row">
            {tags && (
                <TagDropdownSelect
                    value={selectedTags}
                    onChange={setSelectedTags}
                    availableTags={tags}
                />
            )}
            <DropdownMenu
                caption={({ openMenu }: { openMenu: () => void }) => (
                    <Button
                        width={180}
                        icon={selectedClusterKeys.length ? <Filter /> : <ArrowChevronDown />}
                        use="default"
                        onClick={openMenu}
                    >
                        Cluster key
                    </Button>
                )}
            >
                {clusterKeys?.map((clusterKey) => (
                    <div key={clusterKey} className={styles["dropdown-checkbox-item"]}>
                        <Checkbox
                            className={styles["dropdown-checkbox"]}
                            checked={selectedClusterKeys.includes(clusterKey)}
                            onValueChange={(value) => handleClusterToggle(clusterKey, value)}
                        >
                            {clusterKey}
                        </Checkbox>
                    </div>
                ))}
            </DropdownMenu>
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
