// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { RowStack, ColumnStack, Fit, Fill, Fixed } from '../Components/ItemsStack/ItemsStack';

function Outline(props: { children: string }): React.Node {
    return (
        <div style={{ padding: '5px 3px', height: '100%', border: '1px solid #333', boxSizing: 'border-box' }}>
            {props.children}
        </div>
    );
}

storiesOf('ItemsStack', module)
    .add('RowStack', () => (
        <RowStack block gap={2}>
            <Fit>
                <Outline>Fit Item</Outline>
            </Fit>
            <Fill>
                <Outline>Fill Item</Outline>
            </Fill>
            <Fixed width={70}>
                <Outline>Item with fixed width and long, long word "Eyjafjallajökull"</Outline>
            </Fixed>
        </RowStack>
    ))
    .add('ColumnStack', () => (
        <ColumnStack block stretch gap={2} style={{ height: '300px' }}>
            <Fit>
                <Outline>Fit Item</Outline>
            </Fit>
            <Fill>
                <Outline>Fill Item (when parent have fixed height)</Outline>
            </Fill>
            <Fit>
                <Outline>Fit Item</Outline>
            </Fit>
        </ColumnStack>
    ));
