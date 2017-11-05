// @flow
import * as React from 'react';
import cn from './Footer.less';

type Props = {|
    className?: string;
|};

export default function Footer(props: Props): React.Node {
    return (
        <footer className={cn('footer', props.className)}>
            <div className={cn('container')}>© SKB Kontur</div>
        </footer>
    );
}
