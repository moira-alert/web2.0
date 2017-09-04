// @flow
import React from 'react';
import type { TriggerState } from '../../Domain/Trigger';
import cn from './TriggerCurrentState.less';

type Props = {|
    data: TriggerState;
|};

export default function TriggerCurrentState(props: Props): React.Element<*> {
    const { metrics } = props.data;

    return (
        <section width='100%'>
            <header className={cn('header')}>
                <div className={cn('state')}>Sate</div>
                <div className={cn('metric')}>Metric</div>
                <div className={cn('value')}>Value</div>
                <div className={cn('time')}>Event time</div>
            </header>
            {Object.keys(metrics).map((key, index) => {
                const { state, value, event_timestamp: eventTimestamp } = metrics[key];
                return (
                    <div key={index} className={cn('row')}>
                        <div className={cn('state')}>
                            {state}
                        </div>
                        <div className={cn('metric')}>
                            {key}
                        </div>
                        <div className={cn('value')}>
                            {value || (!value && '—')}
                        </div>
                        <div className={cn('time')}>
                            <small>
                                {eventTimestamp}
                            </small>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
