// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TagSelector from '../Components/TagSelector/TagSelector';

const remained = ['abonentsErrors', 'dmitry:ReplicaClusterError.ReplicaClusterWarn', 'build'];
const selected = ['abonentsErrors', 'dev.test.hdd'];
const subscribed = ['test__'];

storiesOf('TagSelector', module)
    .add('Default', () => (
        <TagSelector
            subscribed={[]}
            selected={[]}
            remained={[]}
            onSelect={action('onSelect')}
            onRemove={action('onRemove')}
        />
    ))
    .add('With remained tags', () => (
        <TagSelector
            subscribed={[]}
            selected={[]}
            remained={remained}
            onSelect={action('onSelect')}
            onRemove={action('onRemove')}
        />
    ))
    .add('With selected tags', () => (
        <TagSelector
            subscribed={[]}
            selected={selected}
            remained={[]}
            onSelect={action('onSelect')}
            onRemove={action('onRemove')}
        />
    ))
    .add('With subscribed tags', () => (
        <TagSelector
            subscribed={subscribed}
            selected={[]}
            remained={[]}
            onSelect={action('onSelect')}
            onRemove={action('onRemove')}
        />
    ))
    .add('With all', () => (
        <TagSelector
            subscribed={subscribed}
            selected={subscribed}
            remained={remained}
            onSelect={action('onSelect')}
            onRemove={action('onRemove')}
        />
    ));
