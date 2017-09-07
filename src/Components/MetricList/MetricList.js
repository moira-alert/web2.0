// @flow
import React from 'react';
import moment from 'moment';
import type { Metric } from '../../Domain/Metric';
import type { Maintenance } from '../../Domain/Maintenance';
import { roundValue } from '../../helpers';
import { Maintenances, getMaintenanceCaption } from '../../Domain/Maintenance';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import Dropdown from 'retail-ui/components/Dropdown';
import MenuItem from 'retail-ui/components/MenuItem';
import Button from 'retail-ui/components/Button';
import cn from './MetricList.less';

type Props = {|
    status?: boolean;
    items: Array<{
        name: string;
        data: Metric;
    }>;
    onChange: (maintenance: Maintenance, metric: string) => void;
    onRemove: (metric: string) => void;
|};

export default function MetricList(props: Props): React.Element<*> {
    const { status, items, onChange, onRemove } = props;

    function checkMaintenance(maintenance: number): string {
        const delta = (maintenance || 0) - moment.utc().unix();
        return delta <= 0 ? 'Maintenance' : moment.duration(delta * 1000).humanize();
    }

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
                {items.map(({ name: metric, data }) => {
                    const { value, event_timestamp: eventTimestamp, state, maintenance } = data;
                    return (
                        <div key={metric} className={cn('row')}>
                            {status && (
                                <div className={cn('state')}>
                                    <StatusIndicator statuses={[state]} size={10} />
                                </div>
                            )}
                            <div className={cn('name')}>{metric}</div>
                            <div className={cn('event')}>{moment(eventTimestamp).format('MMMM D, HH:mm:ss')}</div>
                            <div className={cn('value')}>{roundValue(value)}</div>
                            <div className={cn('controls')}>
                                {maintenance && (
                                    <Dropdown caption={checkMaintenance(maintenance)} use='link'>
                                        {Object.keys(Maintenances).map(key => (
                                            <MenuItem key={key} onClick={() => onChange(key, metric)}>
                                                {getMaintenanceCaption(key)}
                                            </MenuItem>
                                        ))}
                                    </Dropdown>
                                )}
                                <Button use='link' icon='Delete' onClick={() => onRemove(metric)}>
                                    Del
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
