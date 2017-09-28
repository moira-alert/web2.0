// @flow
import React from 'react';
import Icon from 'retail-ui/components/Icon';
import ColorHash from 'color-hash';
import cn from './Tag.less';

type Props = {|
    title: string;
    focus?: boolean;
    onClick?: () => void;
    onRemove?: () => void;
|};
type ColorTheme = {|
    backgroundColor: string;
    color: string;
|};

function getColor(title: string): ColorTheme {
    const getBgColor = new ColorHash({ lightness: 0.6, saturation: 0.25 });
    const getTextColor = new ColorHash({ lightness: 0.98, saturation: 0 });
    return {
        backgroundColor: getBgColor.hex(title),
        color: getTextColor.hex(title),
    };
}

export default function Tag(props: Props): React.Element<*> {
    const { title, focus, onRemove, onClick } = props;

    return (
        <div className={cn({ tag: true, removeable: onRemove, focused: focus })} style={getColor(title)}>
            {onClick ? (
                <div onClick={onClick} className={cn('title', 'clickable')}>
                    {title}
                </div>
            ) : (
                <div className={cn('title')}>{title}</div>
            )}
            {onRemove && (
                <div className={cn('remove')} onClick={onRemove}>
                    <Icon name='Delete' />
                </div>
            )}
        </div>
    );
}
