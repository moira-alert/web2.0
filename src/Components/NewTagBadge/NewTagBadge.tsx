import * as React from "react";
import AddIcon from "@skbkontur/react-icons/Add";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import classNames from "classnames/bind";

import styles from "./NewTagBadge.module.less";

const cn = classNames.bind(styles);

type Props = {
    title: string;
    focus?: boolean;
    doNotShowNewTagCaption?: boolean;
    onClick?: () => void;
    onRemove?: () => void;
};

export default function NewTagBadge(props: Props): React.ReactElement {
    const { onRemove, doNotShowNewTagCaption, title, focus, onClick } = props;

    return (
        <div className={cn({ tag: true, removeable: onRemove, focused: focus })}>
            {onClick ? (
                <button
                    type="button"
                    onClick={onClick}
                    className={cn("title", "clickable")}
                    data-tid="New Tag"
                >
                    <AddIcon /> {doNotShowNewTagCaption ? "" : "new tag "}
                    {title}
                </button>
            ) : (
                <div className={cn("title")}>
                    <AddIcon /> {doNotShowNewTagCaption ? "" : "new tag "}
                    {title}
                </div>
            )}
            {onRemove && (
                <button type="button" className={cn("remove")} onClick={onRemove}>
                    <DeleteIcon />
                </button>
            )}
        </div>
    );
}
