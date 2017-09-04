// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TagList from '../Components/TagList/TagList';

const tags = ['abonentsErrors', 'dmitry:ReplicaClusterError.ReplicaClusterWarn', 'test'];

storiesOf('TagList', module)
    .add('Default', () => <TagList tags={tags} />)
    .add('With remove', () => <TagList tags={tags} onRemove={action('onRemove')} />);
