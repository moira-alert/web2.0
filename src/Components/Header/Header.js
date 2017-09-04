// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import LinkUI from 'retail-ui/components/Link';
import RouterLinkWithIcon from '../RouterLink/RouterLink';
import cn from './Header.less';
import logo from '../../logo.png';
type Props = {|
    className?: string;
|};
export default function Header(props: Props): React.Element<*> {
    return (
        <header className={cn('header', props.className)}>
            <div className={cn('container')}>
                <Link to='/' className={cn('logo-link')}>
                    <img className={cn('logo-img')} src={logo} alt='Moira' />
                </Link>
                <nav className={cn('menu')}>
                    <RouterLinkWithIcon to='/settings' icon='Settings'>
                        Settings
                    </RouterLinkWithIcon>
                    <LinkUI href='//moira.readthedocs.org/' icon='HelpBook'>
                        Help
                    </LinkUI>
                </nav>
            </div>
        </header>
    );
}
