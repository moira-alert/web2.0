import * as React from "react";
import Tag from "../Tag/Tag";
import classNames from "classnames/bind";

import styles from "./TagGroup.module.less";

const cn = classNames.bind(styles);

type Props = {
    tags: Array<string>;
    onClick?: (tag: string) => void;
    onRemove?: (tag: string) => void;
};

export default function TagGroup(props: Props): React.ReactElement {
    const { tags, onClick, onRemove } = props;
    return (
        <div className={cn("list")}>
            {tags.map((tag) => (
                <div key={tag} className={cn("item")}>
                    <Tag
                        title={tag}
                        onClick={onClick && (() => onClick(tag))}
                        onRemove={onRemove && (() => onRemove(tag))}
                        data-tid={`tag_${tag}`}
                    />
                </div>
            ))}
        </div>
    );
}
