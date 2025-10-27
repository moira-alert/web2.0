import React, { FC } from "react";
import { useAppSelector } from "../../../store/hooks";
import { NotificationFiltersState } from "../../../store/selectors";

import styles from "./NotificationsFilterCounter.module.less";

export const NotificationsFilterCounter: FC<{ totalCount: number }> = ({ totalCount }) => {
    const { filteredCount } = useAppSelector(NotificationFiltersState);

    return filteredCount === totalCount ? null : (
        <span className={styles.counter}>· {filteredCount} shown</span>
    );
};
