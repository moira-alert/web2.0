// @flow
import React from 'react';
import moment from 'moment';
import Icon from 'retail-ui/components/Icon';
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
    items: {
        [metric: string]: Metric;
    };
    sorting?: 'state' | 'name' | 'event' | 'value';
    sortingDown?: boolean;
    onSort?: (sorting: 'state' | 'name' | 'event' | 'value') => void;
    onChange: (maintenance: Maintenance, metric: string) => void;
    onRemove: (metric: string) => void;
|};

export default function MetricList(props: Props): React.Element<*> {
    const { status, items, onSort, onChange, onRemove, sorting, sortingDown } = props;

    function checkMaintenance(maintenance: ?number): string {
        const delta = (maintenance || 0) - moment.utc().unix();
        return delta <= 0 ? 'Maintenance' : moment.duration(delta * 1000).humanize();
    }

    return (
        <section className={cn('table')}>
            <header className={cn('row', 'header')}>
                {status && (
                    <div className={cn('state')}>
                        <span className={cn('sorting')} onClick={onSort && (() => onSort('state'))}>
                            S {sorting === 'state' && <Icon name={sortingDown ? 'ArrowBoldDown' : 'ArrowBoldUp'} />}
                        </span>
                    </div>
                )}
                <div className={cn('name')}>
                    <span className={cn('sorting')} onClick={onSort && (() => onSort('name'))}>
                        Name {sorting === 'name' && <Icon name={sortingDown ? 'ArrowBoldDown' : 'ArrowBoldUp'} />}
                    </span>
                </div>
                <div className={cn('event')}>
                    <span className={cn('sorting')} onClick={onSort && (() => onSort('event'))}>
                        Last event{' '}
                        {sorting === 'event' && <Icon name={sortingDown ? 'ArrowBoldDown' : 'ArrowBoldUp'} />}
                    </span>
                </div>
                <div className={cn('value')}>
                    <span className={cn('sorting')} onClick={onSort && (() => onSort('value'))}>
                        Value {sorting === 'value' && <Icon name={sortingDown ? 'ArrowBoldDown' : 'ArrowBoldUp'} />}
                    </span>
                </div>
                <div className={cn('controls')} />
            </header>
            <div className={cn('items')}>
                {Object.keys(items).map(metric => {
                    const { value, event_timestamp: eventTimestamp, state, maintenance } = items[metric];
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
                                <Dropdown caption={checkMaintenance(maintenance)} use='link'>
                                    {Object.keys(Maintenances).map(key => (
                                        <MenuItem key={key} onClick={() => onChange(key, metric)}>
                                            {getMaintenanceCaption(key)}
                                        </MenuItem>
                                    ))}
                                </Dropdown>
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
