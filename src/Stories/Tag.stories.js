// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Tag from '../Components/Tag/Tag';
import NewTagBadge from '../Components/NewTagBadge/NewTagBadge';

storiesOf('Tag', module)
    .addDecorator(story => <div style={{ padding: 5 }}>{story()}</div>)
    .add('Default', () => <Tag title='abonentsErrors' />)
    .add('Long title', () => <Tag title='dmitry:ReplicaClusterError.ReplicaClusterWarn' />)
    .add('Short title', () => <Tag title='test' />)
    .add('With onClick', () => <Tag title='abonentsErrors' onClick={action('onClick')} />)
    .add('With onRemove', () => <Tag title='ReplicaClusterWarn' onRemove={action('onRemove')} />)
    .add('With onClick and onRemove', () => (
        <Tag title='ReplicaClusterError' onClick={action('onClick')} onRemove={action('onRemove')} />
    ))
    .add('Focused', () => (
        <Tag title='ReplicaClusterError' focus onClick={action('onClick')} onRemove={action('onRemove')} />
    ))
    .add('NewTagBadgeFocused', () => <NewTagBadge title='ReplicaClusterError' focus onClick={action('onClick')} />)
    .add('NewTagBadge', () => <NewTagBadge title='ReplicaClusterError' onClick={action('onClick')} />);
