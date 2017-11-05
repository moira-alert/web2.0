// @flow
import * as React from 'react';
import Input from 'retail-ui/components/Input';
import Select from 'retail-ui/components/Select';
import { ValidationWrapperV1, tooltip, type ValidationInfo } from 'react-ui-validations';
import { ContactTypeCaptions, type ContactType } from '../../Domain/ContactType';
import validateContact from '../../Helpers/ContactValidator';
import ContactTypeIcon from '../ContactTypeIcon/ContactTypeIcon';
import cn from './ContactEditForm.less';

export type ContactInfo = {
    type: ?ContactType;
    value: string;
};

export type ContactInfoUpdate = $Shape<{
    type: ContactType;
    value: string;
}>;

type Props = {
    contactInfo: ContactInfo;
    onChange: ($Shape<ContactInfoUpdate>) => void;
};

export default class ContactEditForm extends React.Component<Props> {
    props: Props;

    getPlaceholderForContactType(contactType: ?ContactType): string {
        if (contactType == null) {
            return '';
        }
        if (contactType === 'email') {
            return 'Enter email address';
        }
        if (contactType === 'telegram') {
            return 'Enter telegram #channel, @username or group';
        }
        if (contactType === 'phone' || contactType === 'twilio voice') {
            return 'Enter your phone number (e.g. +79.......)';
        }
        if (contactType === 'pushover') {
            return 'Enter your pushover user key';
        }
        if (contactType === 'slack') {
            return 'Enter slack #channel or @username';
        }
        // eslint-disable-next-line no-unused-expressions
        (contactType: empty);
        return '';
    }

    getCommentTextFor(contactType: ?ContactType): string {
        if (contactType == null) {
            return '';
        }
        if (contactType === 'email') {
            return '';
        }
        if (contactType === 'telegram') {
            return 'You have to grant @KonturMoiraBot admin privileges for channel, or execute /start command for groups or personal chats.';
        }
        if (contactType === 'phone') {
            return '';
        }
        if (contactType === 'pushover') {
            return '';
        }
        if (contactType === 'twilio voice') {
            return '';
        }
        if (contactType === 'slack') {
            return '';
        }
        // eslint-disable-next-line no-unused-expressions
        (contactType: empty);
        return '';
    }

    validateValue(): ?ValidationInfo {
        const { contactInfo } = this.props;
        const { value, type } = contactInfo;
        if (type == null) {
            return null;
        }
        return validateContact(type, value);
    }

    render(): React.Node {
        const { onChange, contactInfo } = this.props;
        const { value, type } = contactInfo;

        return (
            <div className={cn('form')}>
                <div className={cn('row')}>
                    <Select
                        placeholder='Select channel type'
                        width={'100%'}
                        value={type}
                        renderItem={(value, item) => (
                            <span>
                                <ContactTypeIcon type={value} /> {item}
                            </span>
                        )}
                        renderValue={(value, item) => (
                            <span>
                                <ContactTypeIcon type={value} /> {item}
                            </span>
                        )}
                        onChange={(e, value) => onChange({ type: value })}
                        items={ContactTypeCaptions}
                    />
                </div>
                <div className={cn('row')}>
                    <ValidationWrapperV1 renderMessage={tooltip('top left')} validationInfo={this.validateValue()}>
                        <Input
                            width={'100%'}
                            disabled={type == null}
                            placeholder={this.getPlaceholderForContactType(type)}
                            value={value}
                            onChange={(e, value) => onChange({ value: value })}
                        />
                    </ValidationWrapperV1>
                </div>
                <div className={cn('row', 'comment')}>{type != null && this.getCommentTextFor(type)}</div>
            </div>
        );
    }
}
