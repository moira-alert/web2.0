// @flow
import React from 'react';
import Tag from '../Tag/Tag';
import cn from './TagList.less';

type Props = {|
    tags: Array<string>;
    onClick?: (tag: string) => void;
    onRemove?: (tag: string) => void;
|};

export default function TagList(props: Props): React.Element<*> {
    const { tags, onClick, onRemove } = props;
    return (
        <div className={cn('list')}>
            {tags.map(tag => {
                return (
                    <div key={tag} className={cn('item')}>
                        <Tag
                            title={tag}
                            onClick={onClick && (() => onClick(tag))}
                            onRemove={onRemove && (() => onRemove(tag))}
                        />
                    </div>
                );
            })}
        </div>
    );
}
