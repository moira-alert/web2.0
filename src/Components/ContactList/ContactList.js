// @flow
import React from 'react';
import type { Contact } from '../../Domain/Contact';
import Icon from 'retail-ui/components/Icon';
import cn from './ContactList.less';

type Props = {|
    items: Array<Contact>;
|};

export default function ContactList(props: Props): React.Element<any> {
    function renderContactIcon(type: string): React.Element<*> {
        let name;
        switch (type) {
            case 'telegram':
                name = 'Telegram2';
                break;
            case 'phone':
                name = 'DeviceSmartphone';
                break;
            default:
                name = 'Mail2';
                break;
        }
        return <Icon name={name} />;
    }

    return (
        <div>
            {props.items.map(({ id, type, value }) => (
                <div key={id} className={cn('row')}>
                    <div className={cn('icon')}>{renderContactIcon(type)}</div>
                    <div className={cn('value')}>{value}</div>
                </div>
            ))}
        </div>
    );
}
