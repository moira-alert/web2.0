// @flow
import React from 'react';
import cn from './Container.less';
type Props = {
    className?: string;
    children?: React.Element<*>;
};
export default function Container(props: Props): React.Element<*> {
    return (
        <div className={cn('container', props.className)}>
            {props.children}
        </div>
    );
}
