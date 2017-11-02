// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { range } from 'lodash';
import TagDropdownSelect from '../Components/TagDropdownSelect/TagDropdownSelect';

type Props = {
    availableTags: Array<string>;
};

type State = {
    tags: Array<string>;
};

class TagDropdownSelectContainer extends React.Component {
    props: Props;
    state: State = {
        tags: [],
    };

    render(): React.Element<any> {
        const { availableTags } = this.props;
        const { tags } = this.state;
        return (
            <TagDropdownSelect value={tags} onChange={x => this.setState({ tags: x })} availableTags={availableTags} />
        );
    }
}

storiesOf('TagDropdownSelect', module)
    .add('Default', () => (
        <TagDropdownSelect value={[]} onChange={action('onChange')} availableTags={['tag1', 'tag2']} />
    ))
    .add('Statefull', () => <TagDropdownSelectContainer availableTags={['tag1', 'tag2']} />)
    .add('StatefullManyTags', () => (
        <TagDropdownSelectContainer
            availableTags={[
                'tag1',
                'tag2',
                ...range(0, 10).map(x => `'a-tag${x}'`),
                ...range(0, 10).map(x => `'b-tag${x}'`),
                ...range(0, 10).map(x => `'c-tag${x}'`),
                ...range(0, 10).map(x => `'d-tag${x}'`),
                ...range(0, 10).map(x => `'e-tag${x}'`),
                ...range(0, 10).map(x => `'z-tag${x}'`),
            ]}
        />
    ))
    .add('StatefullAnomalyManyTags', () => (
        <TagDropdownSelectContainer
            availableTags={[
                'tag1',
                'tag2',
                ...range(0, 50).map(x => `'a-tag${x}'`),
                ...range(0, 50).map(x => `'b-tag${x}'`),
                ...range(0, 50).map(x => `'c-tag${x}'`),
                ...range(0, 50).map(x => `'d-tag${x}'`),
                ...range(0, 50).map(x => `'e-tag${x}'`),
                ...range(0, 50).map(x => `'z-tag${x}'`),
            ]}
        />
    ))
    .add('ManySelectedTags', () => (
        <TagDropdownSelect
            value={[...range(0, 30).map(x => `'a-tag${x}'`)]}
            onChange={action('onChange')}
            availableTags={[...range(0, 50).map(x => `'a-tag${x}'`)]}
        />
    ));
