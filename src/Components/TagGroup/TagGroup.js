// @flow
import * as React from 'react';
import Tag from '../Tag/Tag';
import cn from './TagGroup.less';

type Props = {|
    tags: Array<string>;
    onClick?: (tag: string) => void;
    onRemove?: (tag: string) => void;
|};

export default function TagGroup(props: Props): React.Node {
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
