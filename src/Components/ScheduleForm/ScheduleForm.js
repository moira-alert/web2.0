// @flow
import React from 'react';
import type { Schedule } from '../../Domain/Schedule';

type Props = {|
    data: Schedule;
|};

export default function ScheduleForm(props: Props): React.Element<*> {
    const { days } = props.data;
    return (
        <div>
            <label htmlFor='descr'>Schedule</label>
            <br />
            <label>
                <input type='checkbox' defaultChecked={days.filter(x => !x.enabled).length === 0} />
            </label>
            {days.map((item, i) => {
                const { name, enabled } = item;
                return (
                    <label key={i}>
                        <input type='checkbox' defaultValue={name} defaultChecked={enabled} />
                        {name}
                    </label>
                );
            })}
            <div>
                from <input type='text' defaultValue='' />
                till <input type='text' defaultValue='' />
            </div>
        </div>
    );
}
