// @flow
/* eslint-disable */
import * as React from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import cn from "./FilteredInput.less";

export type FilterValueResult<T> = {
    hintValue?: string,
    displayValue: string | null,
    actualValue: T,
};

function usedForDestructuring(_value: *) {}

type FilteredInputProps<T> = {
    value: T,
    onChange: (value: T) => void,
    filterValue: (value: string) => FilterValueResult<T> | null,
    valueForView: (value: T) => string,
    valueForEdit: (value: T) => string,
    hintForView?: (value: T) => string | null,
    hintForEdit?: (value: T) => string | null,
    onKeyDown?: (event: SyntheticEvent<>) => void,
    onBlur?: (event: SyntheticEvent<>) => void,
    onFocus?: (event: SyntheticEvent<>) => void,
    width: string | number,
};

type HintState = {
    hintValue: ?string,
    hintClip: ?number,
};

type FilteredInputState = {
    displayValue: ?string,
} & HintState;

export default class FilteredInput<T> extends React.Component<
    FilteredInputProps<T>,
    FilteredInputState
> {
    props: FilteredInputProps<T>;

    refs: {
        innerInput: ?HTMLInputElement,
        testWidth: ?HTMLElement,
        root: ?HTMLElement,
    };

    state: FilteredInputState = {
        displayValue: null,
        hintValue: null,
        hintClip: null,
    };

    // eslint-disable-next-line react/sort-comp
    focused: boolean = false;

    selectionStart: number = 0;

    selectionEnd: number = 0;

    componentWillMount() {
        this.reformatValueForView(this.props.value);
    }

    componentDidMount() {
        this.reformatValueForView(this.props.value);
    }

    componentWillReceiveProps(nextProps: FilteredInputProps<T>) {
        if (nextProps.value !== this.props.value) {
            if (!this.focused) {
                this.reformatValueForView(nextProps.value);
            }
        }
    }

    handleInputChange(value: string) {
        const { onChange, filterValue } = this.props;
        const filteredValue = filterValue(value);
        if (filteredValue !== null) {
            this.setState({
                displayValue: filteredValue.displayValue,
                ...this.getHintState(filteredValue.hintValue, filteredValue.displayValue),
            });
            onChange(filteredValue.actualValue);
        } else if (this.refs.innerInput != null) {
            this.setState({}, () => {
                if (this.refs.innerInput != null) {
                    this.refs.innerInput.setSelectionRange(this.selectionStart, this.selectionEnd);
                }
            });
        }
    }

    getHintState(hintValue: ?string, displayValue: ?string): ?$Shape<HintState> {
        if (hintValue === null || hintValue === undefined) {
            return null;
        }
        return {
            hintValue,
            hintClip: this.getClip(displayValue),
        };
    }

    getViewHintState(value: T): $Shape<HintState> {
        const { hintForView, valueForView } = this.props;
        if (hintForView === null || hintForView === undefined) {
            return {};
        }
        return {
            hintValue: hintForView(value),
            hintClip: this.getClip(valueForView(value)),
        };
    }

    getEditHintState(value: T): $Shape<HintState> {
        const { hintForEdit, valueForEdit } = this.props;
        if (hintForEdit === null || hintForEdit === undefined) {
            return {};
        }
        return {
            hintValue: hintForEdit(value),
            hintClip: this.getClip(valueForEdit(value)),
        };
    }

    getClip(value: ?string): number {
        if (this.refs.testWidth != null && this.refs.root != null) {
            this.refs.testWidth.innerHTML = value || "";
            const result = this.refs.root.offsetWidth - this.refs.testWidth.offsetWidth;
            return result - 9;
        }
        return 0;
    }

    reformatValueForView(value: T) {
        if (this.state.displayValue !== this.props.valueForView(value)) {
            this.setState({
                displayValue: this.props.valueForView(value),
                ...this.getViewHintState(value),
            });
        }
    }

    reformatValueForEdit(value: T) {
        if (this.state.displayValue !== this.props.valueForEdit(value)) {
            this.setState({
                displayValue: this.props.valueForEdit(value),
                ...this.getEditHintState(value),
            });
        }
    }

    handleBlur(event: SyntheticEvent<>) {
        const displayValueForEdit = this.props.valueForEdit(this.props.value);
        const nextDisplayValue = this.props.valueForView(this.props.value);
        this.setState({
            displayValue: nextDisplayValue,
            ...this.getViewHintState(this.props.value),
        });
        const filteredValue = this.props.filterValue(displayValueForEdit);
        if (filteredValue !== null) {
            this.props.onChange(filteredValue.actualValue);
        }
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    render(): React.Node {
        const {
            value: _value, // eslint-disable-line no-unused-vars
            filterValue: _filterValue, // eslint-disable-line no-unused-vars
            valueForView: _valueForView, // eslint-disable-line no-unused-vars
            valueForEdit: _valueForEdit, // eslint-disable-line no-unused-vars
            hintForView: _hintForView, // eslint-disable-line no-unused-vars
            hintForEdit: _hintForEdit, // eslint-disable-line no-unused-vars
            onKeyDown,
            onBlur,
            onFocus,
            onChange,
            ...restProps
        } = this.props;
        const { hintClip } = this.state;
        usedForDestructuring(onChange);
        return (
            <span className={cn("root")} ref="root">
                <div className={cn("test-width")} ref="testWidth" />
                {this.state.hintValue && hintClip !== null && hintClip !== undefined && (
                    <div
                        className={cn("hint-container")}
                        style={{ clip: `rect(auto,${hintClip}px,auto,0px)` }}
                    >
                        <Input
                            {...restProps}
                            disabled
                            borderless
                            placeholder={this.state.hintValue ? this.state.hintValue : ""}
                            value=""
                        />
                    </div>
                )}
                <Input
                    {...restProps}
                    ref="innerInput"
                    value={this.state.displayValue || ""}
                    onValueChange={(event, value) => this.handleInputChange(event, value)}
                    onBlur={(event, ...rest) => {
                        this.focused = false;
                        this.handleBlur(event);
                        if (onBlur !== null && onBlur !== undefined) {
                            onBlur(event, ...rest);
                        }
                    }}
                    onFocus={(event, ...rest) => {
                        this.focused = true;
                        this.reformatValueForEdit(this.props.value);
                        if (onFocus !== null && onFocus !== undefined) {
                            onFocus(event, ...rest);
                        }
                    }}
                    onKeyDown={(event, ...rest) => {
                        const target = event.target;
                        if (target instanceof HTMLInputElement) {
                            this.selectionStart = target.selectionStart;
                            this.selectionEnd = target.selectionEnd;
                            if (onKeyDown !== null && onKeyDown !== undefined) {
                                onKeyDown(event, ...rest);
                            }
                        }
                    }}
                />
            </span>
        );
    }
}
