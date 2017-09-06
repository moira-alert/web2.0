// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-router';
import MetricList from '../Components/MetricList/MetricList';

const items = [
    {
        name:
            'vm-ditrace2.nginx.vm-ditrace2.nginx.*.vm-ditrace2.nginx.vm-ditrace3.elasticsearch.vm-ditrace3.ditrace',
        data: {
            event_timestamp: 1503484033,
            state: 'NODATA',
            suppressed: false,
            value: 10.453,
            timestamp: 1503496225,
        },
    },
    {
        name: 'vm-ditrace3.ditrace',
        data: {
            event_timestamp: 1503486527,
            state: 'WARN',
            suppressed: false,
            timestamp: 1503496225,
            maintenance: 1504100565,
        },
    },
    {
        name: 'vm-ditrace3.elasticsearch',
        data: {
            event_timestamp: 1503486527,
            state: 'ERROR',
            suppressed: false,
            timestamp: 1503496225,
            value: 109389189,
            maintenance: 1504118563,
        },
    },
    {
        name: 'vm-ditrace3.nginx',
        data: {
            event_timestamp: 1503484033,
            state: 'OK',
            suppressed: false,
            timestamp: 1503496225,
        },
    },
];

storiesOf('MetricList', module)
    .addDecorator(StoryRouter())
    .add('Default', () => (
        <MetricList
            items={items}
            onChange={action('onChange')}
            onRemove={action('onRemove')}
        />
    ))
    .add('With Status Indicator', () => (
        <MetricList
            items={items}
            status
            onChange={action('onChange')}
            onRemove={action('onRemove')}
        />
    ));
