// @flow
import React from 'react';
import type { Event } from '../../Domain/Event';
import moment from 'moment';
import Icon from 'retail-ui/components/Icon';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import cn from './EventList.less';

type Props = {|
    items: Array<Event>;
|};

export default function EventList(props: Props): React.Element<*> {
    return (
        <section className={cn('list')}>
            <div className={cn('row', 'header')}>
                <div className={cn('name')}>Metric</div>
                <div className={cn('state-change')}>State change</div>
                <div className={cn('date')}>Event time</div>
            </div>
            {props.items.map((data, i) => {
                const { metric, old_state: oldState, state, timestamp } = data;
                return (
                    <div key={i} className={cn('row')}>
                        <div className={cn('name')}>{metric || '—'}</div>
                        <div className={cn('state-change')}>
                            <StatusIndicator statuses={[oldState]} size={14} />
                            <div className={cn('arrow')}>
                                <Icon name='ArrowBoldRight' />
                            </div>
                            <StatusIndicator statuses={[state]} size={14} />
                        </div>
                        <div className={cn('date')}>{moment.unix(timestamp).format('MMMM D, HH:mm:ss')}</div>
                    </div>
                );
            })}
        </section>
    );
}
