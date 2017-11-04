// @flow
import React from 'react';
import { concat, difference } from 'lodash';
import type { Trigger } from '../../Domain/Trigger';
import { ValidationWrapperV1, tooltip, type ValidationInfo } from 'react-ui-validations';
import Icon from 'retail-ui/components/Icon';
import Input from 'retail-ui/components/Input';
import Textarea from 'retail-ui/components/Textarea';
import Button from 'retail-ui/components/Button';
import Select from 'retail-ui/components/Select';
import Tabs from 'retail-ui/components/Tabs';
import FormattedNumberInput from '../FormattedNumberInput/FormattedNumberInput';
import TagSelector from '../TagSelector/TagSelector';
import ScheduleEdit from '../ScheduleEdit/ScheduleEdit';
import { Statuses, getStatusCaption, type Status } from '../../Domain/Status';
import cn from './TriggerEditForm.less';

type Props = {|
    data: $Shape<Trigger>;
    tags: Array<string>;
    onChange: ($Shape<Trigger>) => void;
|};

type State = {
    advancedMode: boolean;
};

export default class TriggerEditForm extends React.Component {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        const { targets, expression } = props.data;
        this.state = {
            advancedMode: targets.length > 1 || expression.length > 0,
        };
    }

    validateRequiredString(value: string, message?: string): ?ValidationInfo {
        return value.trim().length === 0
            ? {
                type: value.trim().length === 0 ? 'submit' : 'lostfocus',
                message: message || "Can't be empty",
            }
            : null;
    }

    validateRequiredNumber(value: ?number): ?ValidationInfo {
        return typeof value !== 'number'
            ? {
                type: typeof value === 'number' ? 'lostfocus' : 'submit',
                message: "Can't be empty",
            }
            : null;
    }

    render(): React.Element<*> {
        const { advancedMode } = this.state;
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
        if (sched == null) {
            throw new Error('InvalidProgramState');
        }
        return (
            <Form>
                <FormRow label='Name'>
                    <ValidationWrapperV1
                        validationInfo={this.validateRequiredString(name)}
                        renderMessage={tooltip('right middle')}>
                        <Input width='100%' value={name} onChange={(e, value) => onChange({ name: value })} />
                    </ValidationWrapperV1>
                </FormRow>
                <FormRow label='Description' useTopAlignForLabel>
                    <Textarea width='100%' value={desc || ''} onChange={(e, value) => onChange({ desc: value })} />
                </FormRow>
                <FormRow label='Target' useTopAlignForLabel>
                    {targets.map((x, i) => (
                        <div key={i} className={cn('target')}>
                            <label className={cn('target-number')}>T{i + 1}</label>
                            <div className={cn('fgroup')}>
                                <div className={cn('fgroup-field')}>
                                    <ValidationWrapperV1
                                        validationInfo={this.validateRequiredString(x)}
                                        renderMessage={tooltip('right middle')}>
                                        <Input
                                            width='100%'
                                            value={x}
                                            onChange={(e, value) =>
                                                onChange({
                                                    targets: [...targets.slice(0, i), value, ...targets.slice(i + 1)],
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
                </FormRow>
                <FormRow>
                    <Tabs
                        value={advancedMode ? 'advanced' : 'simple'}
                        onChange={(e, value) => this.setState({ advancedMode: value === 'advanced' })}>
                        <Tabs.Tab id='simple'>Simple mode</Tabs.Tab>
                        <Tabs.Tab id='advanced'>Advanced mode</Tabs.Tab>
                    </Tabs>
                </FormRow>
                {!advancedMode && (
                    <FormRow label='Warning if'>
                        <ValidationWrapperV1
                            validationInfo={this.validateRequiredNumber(warnValue)}
                            renderMessage={tooltip('right middle')}>
                            <FormattedNumberInput
                                width={80}
                                value={typeof warnValue === 'number' ? warnValue : null}
                                editFormat='0.[00]'
                                onChange={(e, value) => onChange({ warn_value: value || 0 })}
                            />
                        </ValidationWrapperV1>
                    </FormRow>
                )}
                {!advancedMode && (
                    <FormRow label='Error if'>
                        <ValidationWrapperV1
                            validationInfo={this.validateRequiredNumber(errorValue)}
                            renderMessage={tooltip('right middle')}>
                            <FormattedNumberInput
                                width={80}
                                value={typeof errorValue === 'number' ? errorValue : null}
                                editFormat='0.[00]'
                                onChange={(e, value) => onChange({ error_value: value || 0 })}
                            />
                        </ValidationWrapperV1>
                    </FormRow>
                )}
                {advancedMode && (
                    <FormRow label='Expression'>
                        <ValidationWrapperV1
                            validationInfo={this.validateRequiredString(expression, "Expression can't be empty")}
                            renderMessage={tooltip('right middle')}>
                            <Input
                                width='100%'
                                value={expression}
                                onChange={(e, value) => onChange({ expression: value })}
                            />
                        </ValidationWrapperV1>
                    </FormRow>
                )}
                <FormRow singleLineControlGroup>
                    <Select
                        value={ttlState}
                        items={Object.keys(Statuses)
                            .filter(x => x !== Statuses.EXCEPTION)
                            .map(x => [x, getStatusCaption(x)])}
                        onChange={(e, value: Status) => onChange({ ttl_state: value })}
                    />
                    <span>if has no value for</span>
                    <ValidationWrapperV1
                        validationInfo={this.validateRequiredNumber(ttl)}
                        renderMessage={tooltip('right middle')}>
                        <FormattedNumberInput
                            width={80}
                            value={typeof ttl === 'number' ? ttl : null}
                            editFormat='0'
                            onChange={(e, value) => onChange({ ttl: value || 0 })}
                        />
                    </ValidationWrapperV1>
                </FormRow>
                <FormRow label='Watch time'>
                    <ScheduleEdit schedule={sched} onChange={schedule => onChange({ sched: schedule })} />
                </FormRow>
                <FormRow label='Tags' useTopAlignForLabel>
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
                </FormRow>
            </Form>
        );
    }
}

type FormProps = {
    children?: any;
};

function Form({ children }: FormProps): React.Element<*> {
    return <div className={cn('form')}>{children}</div>;
}

type FormRowProps = {
    label?: string;
    useTopAlignForLabel?: boolean;
    singleLineControlGroup?: boolean;
    children?: any;
};

function FormRow({ label, useTopAlignForLabel, singleLineControlGroup, children }: FormRowProps): React.Element<*> {
    return (
        <div className={cn('row')}>
            {label != null && <div className={cn('label', { ['label-for-group']: useTopAlignForLabel })}>{label}</div>}
            <div className={cn('control', { ['group']: singleLineControlGroup })}>{children}</div>
        </div>
    );
}
