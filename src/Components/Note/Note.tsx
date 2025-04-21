import React, { FC } from "react";
import classNames from "classnames/bind";

import styles from "./Note.less";

const cn = classNames.bind(styles);

type NoteType = "info";

interface NoteProps {
    type?: NoteType;
    children: React.ReactNode;
}

export const Note: FC<NoteProps> = ({ type = "info", children }) => {
    return <div className={cn("note", `note--${type}`)}>{children}</div>;
};
