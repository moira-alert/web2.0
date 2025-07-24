import React, { FC } from "react";
import styles from "./NotificationsFilterCounter.module.less";

export const NotificationsFilterCounter: FC<{ filteredCount: number }> = ({ filteredCount }) => {
    return <span className={styles.counter}>· {filteredCount} shown</span>;
};
