// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'retail-ui/components/Icon';
import cn from './RouterLink.less';

export type RouterLinkWithIconProps = {
    icon?: string;
    children?: any;
    className?: string;
};

export default function RouterLink({ icon, children, className, ...props }: RouterLinkWithIconProps): React.Element<*> {
    return (
        <Link className={cn(className, 'link')} {...props}>
            {icon && <Icon name={icon} />}
            {icon && '\u00A0'}
            <span className={cn('content')}>{children}</span>
        </Link>
    );
}
