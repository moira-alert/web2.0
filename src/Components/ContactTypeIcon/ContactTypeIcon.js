// @flow
import * as React from 'react';
import type { ContactType } from '../../Domain/ContactType';
import Icon from 'retail-ui/components/Icon';
import SvgIcon from '../SvgIcon/SvgIcon';
import PushoverLogo from './pushover-logo.svg';
import SlackLogo from './slack-logo.svg';
import TwilioLogo from './twilio-logo.svg';

type Props = {
    type: ContactType;
};

export default function ContactTypeIcon({ type }: Props): React.Element<any> {
    switch (type) {
        case 'telegram':
            return <Icon name={'Telegram2'} />;
        case 'phone':
            return <Icon name={'DeviceSmartphone'} />;
        case 'pushover':
            return <SvgIcon path={PushoverLogo} size={14} offsetTop={2} />;
        case 'slack':
            return <SvgIcon path={SlackLogo} size={15} offsetTop={2}/>;
        case 'twilio voice':
            return <SvgIcon path={TwilioLogo} size={14} offsetTop={2}/>;
        case 'email':
            return <Icon name={'Mail2'} />;
        default:
            // eslint-disable-next-line no-unused-expressions
            (type: empty);
            return <Icon name={'Mail2'} />;
    }
}
