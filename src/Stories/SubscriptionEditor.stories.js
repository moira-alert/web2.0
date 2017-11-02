// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ValidationContainer } from 'react-ui-validations';
import { ContactTypes } from '../Domain/ContactType';
import SubscriptionEditor from '../Components/SubscriptionEditor/SubscriptionEditor';
import { createSchedule, WholeWeek } from '../Domain/Schedule';

storiesOf('SubscriptionEditor', module)
    .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
    .add('Default', () => (
        <SubscriptionEditor
            onChange={action('onChange')}
            tags={['tag1', 'tag2']}
            contacts={[
                {
                    id: '1',
                    type: ContactTypes.email,
                    user: '1',
                    value: 'test@mail.ru',
                },
            ]}
            subscription={{
                sched: createSchedule(WholeWeek),
                tags: ['tag1'],
                throttling: false,
                contacts: ['1'],
                enabled: true,
                user: '1',
                id: '1',
            }}
        />
    ));
