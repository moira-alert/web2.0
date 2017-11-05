// @flow
import React from 'react';
import Radio from 'retail-ui/components/Radio';
import { ValidationWrapperV1, tooltip, type ValidationInfo } from 'react-ui-validations';
import { ColumnStack, RowStack, Fit, Fixed } from '../ItemsStack/ItemsStack';
import FormattedNumberInput from '../FormattedNumberInput/FormattedNumberInput';
import StatusIcon from '../StatusIcon/StatusIcon';
import cn from './TriggerSimpleModeEditor.less';

export type TriggerSimpleModeSettings = {
    warn_value: ?number;
    error_value: ?number;
};

type Props = {|
    value: TriggerSimpleModeSettings;
    onChange: TriggerSimpleModeSettings => void;
|};

type WatchType = 'raising' | 'falling';

type State = {
    watchFor: WatchType;
    raisingValues: TriggerSimpleModeSettings;
    fallingValues: TriggerSimpleModeSettings;
};

export default class TriggerSimpleModeEditor extends React.Component {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        if (props.value.warn_value != null && props.value.error_value != null) {
            const watchForType = this.getWatchForType(props.value.warn_value, props.value.error_value);
            this.state = {
                watchFor: watchForType,
                raisingValues: watchForType === 'raising' ? props.value : { warn_value: null, error_value: null },
                fallingValues: watchForType === 'failling' ? props.value : { warn_value: null, error_value: null },
            };
        }
        this.state = {
            watchFor: 'raising',
            raisingValues: props.value,
            fallingValues: { warn_value: null, error_value: null },
        };
    }

    getWatchForType(warnValue: number, errorValue: number): WatchType {
        return warnValue <= errorValue ? 'raising' : 'falling';
    }

    handleChangeWarnValue = (e: Event, warnValue: ?number) => {
        const { value, onChange } = this.props;
        const { watchFor } = this.state;
        if (watchFor === 'raising') {
            this.setState({ raisingValues: { ...value, warn_value: warnValue } });
        }
        else {
            this.setState({ fallingValues: { ...value, warn_value: warnValue } });
        }
        onChange({ ...value, warn_value: warnValue });
    };

    handleChangeErrorValue = (e: Event, errorValue: ?number) => {
        const { value, onChange } = this.props;
        const { watchFor } = this.state;
        if (watchFor === 'raising') {
            this.setState({ raisingValues: { ...value, error_value: errorValue } });
        }
        else {
            this.setState({ fallingValues: { ...value, error_value: errorValue } });
        }
        onChange({ ...value, error_value: errorValue });
    };

    handleSetRaisingWatchType = () => {
        const { onChange } = this.props;
        const { raisingValues } = this.state;
        this.setState({ watchFor: 'raising' });
        onChange(raisingValues);
    };

    handleSetFallingWatchType = () => {
        const { onChange } = this.props;
        const { fallingValues } = this.state;
        this.setState({ watchFor: 'falling' });
        onChange(fallingValues);
    };

    validateRaisingWarn(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== 'raising') {
            return null;
        }
        const { value } = this.props;
        if (value.warn_value == null) {
            return { message: "Can't be empty", type: 'submit' };
        }
        return null;
    }

    validateRaisingError(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== 'raising') {
            return null;
        }
        const { value } = this.props;
        if (value.error_value == null) {
            return { message: "Can't be empty", type: 'submit' };
        }
        if (value.warn_value != null && value.warn_value > value.error_value) {
            return { message: 'Error value must be greate than or equals to warn value', type: 'submit' };
        }
        return null;
    }

    validateFallingWarn(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== 'falling') {
            return null;
        }
        const { value } = this.props;
        if (value.warn_value == null) {
            return { message: "Can't be empty", type: 'submit' };
        }
        return null;
    }

    validateFallingError(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== 'falling') {
            return null;
        }
        const { value } = this.props;
        if (value.error_value == null) {
            return { message: "Can't be empty", type: 'submit' };
        }
        if (value.warn_value != null && value.warn_value < value.error_value) {
            return { message: 'Error value must be less than or equals to warn value', type: 'submit' };
        }
        return null;
    }

    render(): React.Element<*> {
        const { watchFor, raisingValues, fallingValues } = this.state;
        const { value } = this.props;

        return (
            <div>
                <ColumnStack block gap={4} stretch>
                    <Fit>
                        <ColumnStack block gap={2} stretch>
                            <Fit>
                                <span className={cn('radio')} onClick={this.handleSetRaisingWatchType}>
                                    <Radio checked={watchFor === 'raising'}>Watch for value raising:</Radio>
                                </span>
                            </Fit>
                            <Fit className={cn('state-block')}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== 'raising'} status={'WARN'} />
                                    </Fit>
                                    <Fixed
                                        className={cn('state-caption', { disabled: watchFor !== 'raising' })}
                                        width={100}>
                                        WARN if T1 &gt;={' '}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip('right middle')}
                                            validationInfo={this.validateRaisingWarn()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat='0'
                                                value={
                                                    watchFor === 'raising' ? value.warn_value : raisingValues.warn_value
                                                }
                                                onChange={this.handleChangeWarnValue}
                                                disabled={watchFor !== 'raising'}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit className={cn('state-block')}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== 'raising'} status={'ERROR'} />
                                    </Fit>
                                    <Fixed
                                        className={cn('state-caption', { disabled: watchFor !== 'raising' })}
                                        width={100}>
                                        ERROR if T1 &gt;={' '}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip('right middle')}
                                            validationInfo={this.validateRaisingError()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat='0'
                                                value={
                                                    watchFor === 'raising' ? (
                                                        value.error_value
                                                    ) : (
                                                        raisingValues.error_value
                                                    )
                                                }
                                                onChange={this.handleChangeErrorValue}
                                                disabled={watchFor !== 'raising'}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                        </ColumnStack>
                    </Fit>
                    <Fit>
                        <ColumnStack block gap={2} stretch>
                            <Fit>
                                <span className={cn('radio')} onClick={this.handleSetFallingWatchType}>
                                    <Radio checked={watchFor === 'falling'}> Watch for value falling:</Radio>
                                </span>
                            </Fit>

                            <Fit className={cn('state-block')}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== 'falling'} status={'WARN'} />
                                    </Fit>
                                    <Fixed
                                        className={cn('state-caption', { disabled: watchFor !== 'falling' })}
                                        width={100}>
                                        WARN if T1 &gt;={' '}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip('right middle')}
                                            validationInfo={this.validateFallingWarn()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat='0'
                                                value={
                                                    watchFor === 'falling' ? value.warn_value : fallingValues.warn_value
                                                }
                                                onChange={this.handleChangeWarnValue}
                                                disabled={watchFor !== 'falling'}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit className={cn('state-block')}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== 'falling'} status={'ERROR'} />
                                    </Fit>
                                    <Fixed
                                        className={cn('state-caption', { disabled: watchFor !== 'falling' })}
                                        width={100}>
                                        ERROR if T1 &gt;={' '}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip('right middle')}
                                            validationInfo={this.validateFallingError()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat='0'
                                                value={
                                                    watchFor === 'falling' ? (
                                                        value.error_value
                                                    ) : (
                                                        fallingValues.error_value
                                                    )
                                                }
                                                onChange={this.handleChangeErrorValue}
                                                disabled={watchFor !== 'falling'}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                        </ColumnStack>
                    </Fit>
                </ColumnStack>
            </div>
        );
    }
}
