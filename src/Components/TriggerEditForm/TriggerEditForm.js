// @flow
import React from 'react';
import { concat, difference } from 'lodash';
import type { Trigger } from '../../Domain/Trigger';
import { ValidationWrapperV1, tooltip } from 'react-ui-validations';
import Icon from 'retail-ui/components/Icon';
import Input from 'retail-ui/components/Input';
import Textarea from 'retail-ui/components/Textarea';
import Button from 'retail-ui/components/Button';
import Select from 'retail-ui/components/Select';
import Tabs from 'retail-ui/components/Tabs';
import Radio from 'retail-ui/components/Radio';
import Checkbox from 'retail-ui/components/Checkbox';
import FormattedNumberInput from '../FormattedNumberInput/FormattedNumberInput';
import TagSelector from '../TagSelector/TagSelector';
import { Statuses, getStatusCaption } from '../../Domain/Status';
import cn from './TriggerEditForm.less';

type Props = {|
    data: $Shape<Trigger>;
    tags: Array<string>;
    onChange: ($Shape<Trigger>) => void;
|};
type State = {|
    advancedMode: boolean;
    allDay: boolean;
|};

export default class TriggerEditForm extends React.Component {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        const { targets, expression, sched } = props.data;
        const { startOffset, endOffset } = sched;
        this.state = {
            advancedMode: targets.length > 1 || expression.length > 0,
            allDay: startOffset === 0 && endOffset === 1439,
        };
    }

    formatTime(time: number): string {
        const HOUR_IN_DAY = 24;
        const MIN_IN_HOUR = 60;
        const hours = Math.floor(time / MIN_IN_HOUR) < HOUR_IN_DAY ? Math.floor(time / MIN_IN_HOUR) : 0;
        const minutes = time % MIN_IN_HOUR < MIN_IN_HOUR ? time % MIN_IN_HOUR : 0;
        return (hours > 9 ? hours : '0' + hours) + ':' + (minutes > 9 ? minutes : '0' + minutes);
    }

    parseTime(time: string): number {
        const HOUR_IN_DAY = 24;
        const MIN_IN_HOUR = 60;
        const [hours, minutes] = time.split(':');
        const parsedHours = parseInt(hours, 10) < HOUR_IN_DAY ? parseInt(hours, 10) : 0;
        const parsedMinutes = parseInt(minutes, 10) < MIN_IN_HOUR ? parseInt(minutes, 10) : 0;
        return parsedHours * MIN_IN_HOUR + parsedMinutes;
    }

    render(): React.Element<*> {
        const { advancedMode, allDay } = this.state;
        const { data, onChange, tags: allTags } = this.props;
        const {
            name,
            desc,
            targets,
            tags,
            expression,
            ttl,
            ttl_state: ttlState,
            warn_value: warnValue,
            error_value: errorValue,
            sched,
        } = data;
        const { days, startOffset, endOffset } = sched;
        return (
            <div className={cn('form')}>
                <div className={cn('row')}>
                    <div className={cn('label')}>Name</div>
                    <div className={cn('control')}>
                        <ValidationWrapperV1
                            validationInfo={
                                name.trim().length === 0 ? (
                                {
                                    type: name.trim().length === 0 ? 'submit' : 'lostfocus',
                                    message: "Can't be empty",
                                }
                                ) : null
                            }
                            renderMessage={tooltip('right middle')}>
                            <Input width='100%' value={name} onChange={(e, value) => onChange({ name: value })} />
                        </ValidationWrapperV1>
                    </div>
                </div>
                <div className={cn('row')}>
                    <div className={cn('label', 'label-for-group')}>Description</div>
                    <div className={cn('control')}>
                        <Textarea width='100%' value={desc} onChange={(e, value) => onChange({ desc: value })} />
                    </div>
                </div>
                <div className={cn('row')}>
                    <div className={cn('label', 'label-for-group')}>Target</div>
                    <div className={cn('control')}>
                        {targets.map((x, i) => (
                            <div key={i} className={cn('target')}>
                                <label className={cn('target-number')}>T{i + 1}</label>
                                <div className={cn('fgroup')}>
                                    <div className={cn('fgroup-field')}>
                                        <ValidationWrapperV1
                                            validationInfo={
                                                x.trim().length === 0 ? (
                                                {
                                                    type: x.trim().length === 0 ? 'submit' : 'lostfocus',
                                                    message: "Can't be empty",
                                                }
                                                ) : null
                                            }
                                            renderMessage={tooltip('right middle')}>
                                            <Input
                                                width='100%'
                                                value={x}
                                                onChange={(e, value) =>
                                                    onChange({
                                                        targets: [
                                                            ...targets.slice(0, i),
                                                            value,
                                                            ...targets.slice(i + 1),
                                                        ],
                                                    })}
                                            />
                                        </ValidationWrapperV1>
                                    </div>
                                    {targets.length > 1 && (
                                        <div className={cn('fgroup-control')}>
                                            <Button
                                                onClick={() =>
                                                    onChange({
                                                        targets: [...targets.slice(0, i), ...targets.slice(i + 1)],
                                                    })}>
                                                <Icon name='Remove' />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Button
                            use='link'
                            icon='Add'
                            onClick={() =>
                                onChange({
                                    targets: [...targets, ''],
                                })}>
                            Add one more
                        </Button>
                    </div>
                </div>
                <div className={cn('row')}>
                    <div className={cn('control')}>
                        <Tabs
                            value={advancedMode ? 'advanced' : 'simple'}
                            onChange={(e, value) => this.setState({ advancedMode: value === 'advanced' })}>
                            <Tabs.Tab id='simple'>Simple mode</Tabs.Tab>
                            <Tabs.Tab id='advanced'>Advanced mode</Tabs.Tab>
                        </Tabs>
                    </div>
                </div>
                {!advancedMode && (
                    <div className={cn('row')}>
                        <div className={cn('label')}>Warning if</div>
                        <div className={cn('control')}>
                            <ValidationWrapperV1
                                validationInfo={
                                    typeof warnValue !== 'number' ? (
                                    {
                                        type: typeof warnValue === 'number' ? 'lostfocus' : 'submit',
                                        message: "Can't be empty",
                                    }
                                    ) : null
                                }
                                renderMessage={tooltip('right middle')}>
                                <FormattedNumberInput
                                    id='warningValue'
                                    width={80}
                                    value={typeof warnValue === 'number' ? warnValue : null}
                                    editFormat='0.[00]'
                                    onChange={(e, value) => onChange({ warn_value: value || 0 })}
                                />
                            </ValidationWrapperV1>
                        </div>
                    </div>
                )}
                {!advancedMode && (
                    <div className={cn('row')}>
                        <div className={cn('label')}>Error if</div>
                        <div className={cn('control')}>
                            <ValidationWrapperV1
                                validationInfo={
                                    typeof errorValue !== 'number' ? (
                                    {
                                        type: typeof errorValue === 'number' ? 'lostfocus' : 'submit',
                                        message: "Can't be empty",
                                    }
                                    ) : null
                                }
                                renderMessage={tooltip('right middle')}>
                                <FormattedNumberInput
                                    id='errorValue'
                                    width={80}
                                    value={typeof errorValue === 'number' ? errorValue : null}
                                    editFormat='0.[00]'
                                    onChange={(e, value) => onChange({ error_value: value || 0 })}
                                />
                            </ValidationWrapperV1>
                        </div>
                    </div>
                )}
                {advancedMode && (
                    <div className={cn('row')}>
                        <div className={cn('label')}>Expression</div>
                        <div className={cn('control')}>
                            <ValidationWrapperV1
                                validationInfo={
                                    expression.trim().length === 0 ? (
                                    {
                                        type: expression.trim().length === 0 ? 'submit' : 'lostfocus',
                                        message: "Expression can't be empty",
                                    }
                                    ) : null
                                }
                                renderMessage={tooltip('right middle')}>
                                <Input
                                    width='100%'
                                    value={expression}
                                    onChange={(e, value) => onChange({ expression: value })}
                                />
                            </ValidationWrapperV1>
                        </div>
                    </div>
                )}
                <div className={cn('row')}>
                    <div className={cn('control', 'group')}>
                        <Select
                            value={getStatusCaption(ttlState)}
                            items={Object.keys(Statuses)
                                .filter(x => x !== Statuses.EXCEPTION)
                                .map(x => [x, getStatusCaption(x)])}
                            onChange={(e, value) => onChange({ ttl_state: value })}
                        />
                        <span>if has no value for</span>
                        <ValidationWrapperV1
                            validationInfo={
                                typeof ttl !== 'number' ? (
                                {
                                    type: typeof ttl === 'number' ? 'lostfocus' : 'submit',
                                    message: "Error value can't be empty",
                                }
                                ) : null
                            }
                            renderMessage={tooltip('right middle')}>
                            <FormattedNumberInput
                                id='ttlValue'
                                width={80}
                                value={typeof ttl === 'number' ? ttl : null}
                                editFormat='0'
                                onChange={(e, value) => onChange({ ttl: value || 0 })}
                            />
                        </ValidationWrapperV1>
                        <span>seconds</span>
                    </div>
                </div>
                <div className={cn('row')}>
                    <div className={cn('label')}>Watch time</div>
                    <div className={cn('control')}>
                        <div className={cn('days')}>
                            {days.map(({ name, enabled }, i) => (
                                <Checkbox
                                    key={name}
                                    checked={enabled}
                                    onChange={(e, checked) =>
                                        onChange({
                                            sched: {
                                                ...sched,
                                                days: [
                                                    ...days.slice(0, i),
                                                    { name, enabled: checked },
                                                    ...days.slice(i + 1),
                                                ],
                                            },
                                        })}>
                                    {name}
                                </Checkbox>
                            ))}
                        </div>
                        <div className={cn('group')}>
                            <span
                                className={cn('radio')}
                                onClick={() => {
                                    onChange({
                                        sched: {
                                            ...sched,
                                            startOffset: 0,
                                            endOffset: 1439,
                                        },
                                    });
                                    this.setState({ allDay: true });
                                }}>
                                <Radio checked={allDay} />
                                All day
                            </span>
                            <span className={cn('radio')} onClick={() => this.setState({ allDay: false })}>
                                <Radio checked={!allDay} />
                                <span>At specific interval</span>
                                <ValidationWrapperV1
                                    validationInfo={
                                        startOffset >= endOffset ? (
                                        {
                                            type: 'lostfocus',
                                            message: 'Start time must be less than end time',
                                        }
                                        ) : null
                                    }
                                    renderMessage={tooltip('right middle')}>
                                    <Input
                                        value={this.formatTime(startOffset)}
                                        width={60}
                                        mask='99:99'
                                        disabled={allDay}
                                        onChange={(e, value) =>
                                            onChange({ sched: { ...sched, startOffset: this.parseTime(value) } })}
                                    />
                                </ValidationWrapperV1>
                                <span>—</span>
                                <ValidationWrapperV1
                                    validationInfo={
                                        startOffset >= endOffset ? (
                                        {
                                            type: 'lostfocus',
                                            message: 'Start time must be less than end time',
                                        }
                                        ) : null
                                    }
                                    renderMessage={tooltip('right middle')}>
                                    <Input
                                        value={this.formatTime(endOffset)}
                                        width={60}
                                        mask='99:99'
                                        disabled={allDay}
                                        onChange={(e, value) =>
                                            onChange({ sched: { ...sched, endOffset: this.parseTime(value) } })}
                                    />
                                </ValidationWrapperV1>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cn('row')}>
                    <div className={cn('label', 'label-for-group')}>Name</div>
                    <div className={cn('control')}>
                        <ValidationWrapperV1
                            validationInfo={
                                tags.length === 0 ? (
                                {
                                    type: 'submit',
                                    message: 'Select at least one tag',
                                }
                                ) : null
                            }
                            renderMessage={tooltip('right top')}>
                            <TagSelector
                                subscribed={[]}
                                selected={tags}
                                remained={difference(allTags, tags)}
                                onSelect={tag =>
                                    onChange({
                                        tags: concat(tags, [tag]),
                                    })}
                                onRemove={tag =>
                                    onChange({
                                        tags: difference(tags, [tag]),
                                    })}
                            />
                        </ValidationWrapperV1>
                    </div>
                </div>
            </div>
        );
    }
}
