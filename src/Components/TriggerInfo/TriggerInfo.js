// @flow
import React from 'react';
import moment from 'moment';
import type { Trigger } from '../../Domain/Trigger';
import type { Schedule } from '../../Domain/Schedule';
import Link from 'retail-ui/components/Link';
import Button from 'retail-ui/components/Button';
import TagGroup from '../TagGroup/TagGroup';
import { getJSONContent } from '../../helpers';
import cn from './TriggerInfo.less';

type Props = {|
    data: Trigger;
    onThrottlingRemove: (triggerId: string) => void;
|};

function ScheduleView(props: { data: Schedule }): React.Element<*> {
    const { days, startOffset, endOffset } = props.data;
    const enabledDays = days.filter(({ enabled }) => enabled);
    const viewDays = days.length === enabledDays.length ? 'Everyday' : enabledDays.map(({ name }) => name).join(', ');
    const viewTime =
        moment('1900-01-01 00:00:00')
            .add(startOffset, 'minutes')
            .format('HH:mm') +
        '–' +
        moment('1900-01-01 00:00:00')
            .add(endOffset, 'minutes')
            .format('HH:mm');
    return (
        <div>
            {viewDays} {viewTime}
        </div>
    );
}

export default function TriggerInfo(props: Props): React.Element<*> {
    const {
        id,
        name,
        targets,
        desc,
        expression,
        error_value: errorValue,
        warn_value: warnValue,
        ttl_state: ttlState,
        ttl,
        sched,
        tags,
        throttling,
    } = props.data;
    return (
        <section>
            <header className={cn('header')}>
                <h1 className={cn('title')}>{name}</h1>
                <div className={cn('controls')}>
                    {throttling !== 0 && (
                        <Link use='danger' icon='Clear' onClick={() => props.onThrottlingRemove(id)}>
                            Disable throttling
                        </Link>
                    )}
                    <a
                        href='#download'
                        onClick={(event: Event) =>
                            event.currentTarget instanceof HTMLAnchorElement
                                ? (event.currentTarget.href = getJSONContent(props.data))
                                : null}
                        download={`trigger-${id}.json`}>
                        <Button use='link' icon='Export'>
                            Export
                        </Button>
                    </a>
                </div>
            </header>
            <dl className={cn('list')}>
                <dt>Target</dt>
                <dd>{targets.map((target, i) => <div key={i}>{target}</div>)}</dd>
                {desc && <dt>Description</dt>}
                {desc && <dd>{desc}</dd>}
                {!expression && <dt>Value</dt>}
                {!expression && (
                    <dd>
                        Warning: {warnValue}, Error: {errorValue}, Set {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}
                {expression && <dt>Expression</dt>}
                {expression && <dd>{expression}</dd>}
                {sched && (<dt>Schedule</dt>)}
                {sched && (<dd>
                    <ScheduleView data={sched} />
                </dd>)}
                <dt>Tags</dt>
                <dd>
                    <TagGroup tags={tags} />
                </dd>
            </dl>
        </section>
    );
}
