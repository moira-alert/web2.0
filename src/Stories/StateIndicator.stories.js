// @flow
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Statuses } from '../Domain/Status';
import StatusIndicator from '../Components/StatusIndicator/StatusIndicator';

storiesOf('State Indicator', module)
    .add('OK', () => <StatusIndicator statuses={[Statuses.OK]} />)
    .add('NODATA', () => <StatusIndicator statuses={[Statuses.NODATA]} />)
    .add('WARN', () => <StatusIndicator statuses={[Statuses.WARN]} />)
    .add('ERROR', () => <StatusIndicator statuses={[Statuses.ERROR]} />)
    .add('NODATA & WARN', () => <StatusIndicator statuses={[Statuses.NODATA, Statuses.WARN]} />)
    .add('NODATA & ERROR', () => <StatusIndicator statuses={[Statuses.NODATA, Statuses.ERROR]} />)
    .add('WARN & ERROR', () => <StatusIndicator statuses={[Statuses.WARN, Statuses.ERROR]} />)
    .add('NODATA & WARN & ERROR', () =>
        <StatusIndicator statuses={[Statuses.NODATA, Statuses.WARN, Statuses.ERROR]} />
    );
