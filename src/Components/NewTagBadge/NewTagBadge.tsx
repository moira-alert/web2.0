import type { ReactElement } from "react";
import { IconPlusRegular16 } from "@skbkontur/icons/IconPlusRegular16";
import { IconXRegular16 } from "@skbkontur/icons/IconXRegular16";
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

export default function NewTagBadge(props: Props): ReactElement {
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
                    <IconPlusRegular16 /> {doNotShowNewTagCaption ? "" : "new tag "}
                    {title}
                </button>
            ) : (
                <div className={cn("title")}>
                    <IconPlusRegular16 /> {doNotShowNewTagCaption ? "" : "new tag "}
                    {title}
                </div>
            )}
            {onRemove && (
                <button type="button" className={cn("remove")} onClick={onRemove}>
                    <IconXRegular16 />
                </button>
            )}
        </div>
    );
}
