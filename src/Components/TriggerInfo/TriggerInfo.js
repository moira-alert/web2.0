// @flow
import React from 'react';
import Button from 'retail-ui/components/Button';
import type { Trigger } from '../../Domain/Trigger';
import TagList from '../TagList/TagList';
import { getJSONContent } from '../../helpers';
import cn from './TriggerInfo.less';

type Props = {|
    data: Trigger,
|};

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
    } = props.data;
    return (
        <section>
            <header className={cn('header')}>
                <h1 className={cn('title')}>{name}</h1>
                <div className={cn('controls')}>
                    <a
                        href="#download"
                        onClick={(event: Event) =>
                            event.currentTarget instanceof HTMLAnchorElement
                                ? (event.currentTarget.href = getJSONContent(
                                      props.data
                                  ))
                                : null}
                        download={`trigger-${id}.json`}
                    >
                        <Button use="link" icon="Export">
                            Export
                        </Button>
                    </a>
                </div>
            </header>
            <dl className={cn('list')}>
                <dt>Target</dt>
                <dd>
                    {targets.map((target, i) => <div key={i}>{target}</div>)}
                </dd>
                {desc && <dt>Description</dt>}
                {desc && <dd>{desc}</dd>}
                {!expression && <dt>Value</dt>}
                {!expression && (
                    <dd>
                        Warning: {warnValue}, Error: {errorValue}, Set{' '}
                        {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}
                {expression && <dt>Expression</dt>}
                {expression && <dd>{expression}</dd>}
                <dt>Schedule</dt>
                <dd>
                    {sched.days.filter(item => item.enabled).map((item, i) => (
                        <span key={i}>
                            {i !== 0 && ', '}
                            {item.name}
                        </span>
                    ))}
                </dd>
                <dt>Tags</dt>
                <dd>
                    <TagList tags={tags} />
                </dd>
            </dl>
        </section>
    );
}
