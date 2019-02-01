// @flow
import * as React from "react";
import AddIcon from "@skbkontur/react-icons/Add";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import cn from "./NewTagBadge.less";

type Props = {|
    title: string,
    focus?: boolean,
    doNotShowNewTagCaption?: boolean,
    onClick?: () => void,
    onRemove?: () => void,
|};

export default function NewTagBadge(props: Props): React.Node {
    const { onRemove, doNotShowNewTagCaption, title, focus, onClick } = props;

    return (
        <div className={cn({ tag: true, removeable: onRemove, focused: focus })}>
            {onClick ? (
                <button type="button" onClick={onClick} className={cn("title", "clickable")}>
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
