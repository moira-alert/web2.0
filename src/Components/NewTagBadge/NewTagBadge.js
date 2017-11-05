// @flow
import * as React from "react";
import Icon from "retail-ui/components/Icon";
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
                <div onClick={onClick} className={cn("title", "clickable")}>
                    <Icon name="Add" /> {doNotShowNewTagCaption ? "" : "new tag "}
                    {title}
                </div>
            ) : (
                <div className={cn("title")}>
                    <Icon name="Add" /> {doNotShowNewTagCaption ? "" : "new tag "}
                    {title}
                </div>
            )}
            {onRemove && (
                <div className={cn("remove")} onClick={onRemove}>
                    <Icon name="Delete" />
                </div>
            )}
        </div>
    );
}
