// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ContactTypes } from '../Domain/ContactType';
import ContactSelect from '../Components/ContactSelect/ContactSelect';

storiesOf('ContactSelect', module)
    .add('Empty', () => (
        <ContactSelect
            contactIds={[]}
            onChange={action('onChange')}
            availableContacts={[
                {
                    id: '1',
                    type: ContactTypes.pushover,
                    user: '1',
                    value: 'u13XsadLKJjh273jafksaja7asjdkds ',
                },
                {
                    id: '2',
                    type: ContactTypes.email,
                    user: '1',
                    value: 'test@mail.ru',
                },
            ]}
        />
    ))
    .add('Default', () => (
        <ContactSelect
            contactIds={['1']}
            onChange={action('onChange')}
            availableContacts={[
                {
                    id: '1',
                    type: ContactTypes.pushover,
                    user: '1',
                    value: 'u13XsadLKJjh273jafksaja7asjdkds ',
                },
                {
                    id: '2',
                    type: ContactTypes.email,
                    user: '1',
                    value: 'test@mail.ru',
                },
            ]}
        />
    ));
