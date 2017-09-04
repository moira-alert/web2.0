// @flow
import React from 'react';
import moment from 'moment';
import type { Metric } from '../../Domain/Metric';
import { roundValue } from '../../helpers';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import cn from './MetricList.less';

type Props = {|
    status?: boolean;
    items: Array<{
        name: string;
        data: Metric;
    }>;
|};

export default function MetricList(props: Props): React.Element<*> {
    const { status, items } = props;
    return (
        <section className={cn('table')}>
            <header className={cn('row', 'header')}>
                {status && <div className={cn('state')} />}
                <div className={cn('name')}>Name</div>
                <div className={cn('event')}>Last event</div>
                <div className={cn('value')}>Value</div>
                <div className={cn('controls')} />
            </header>
            <div className={cn('items')}>
                {items.map(({ name, data }) => {
                    const { value, event_timestamp: eventTimestamp, state } = data;
                    return (
                        <div key={name} className={cn('row')}>
                            {status &&
                                <div className={cn('state')}>
                                    <StatusIndicator statuses={[state]} size={10} />
                                </div>}
                            <div className={cn('name')}>
                                {name}
                            </div>
                            <div className={cn('event')}>
                                {moment(eventTimestamp).format('MMMM D, HH:mm:ss')}
                            </div>
                            <div className={cn('value')}>
                                {roundValue(value)}
                            </div>
                            <div className={cn('controls')} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
