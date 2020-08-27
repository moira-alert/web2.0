import * as React from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import cn from "./FilteredInput.less";

export type FilterValueResult<T> = {
    hintValue?: string;
    displayValue: string | null;
    actualValue: T;
};

type FilteredInputProps<T> = {
    value: T;
    onChange: (value: T) => void;
    filterValue: (value: string) => FilterValueResult<T> | null;
    valueForView: (value: T) => string;
    valueForEdit: (value: T) => string;
    hintForView?: (value: T) => string | null;
    hintForEdit?: (value: T) => string | null;
    onKeyDown?: (event: React.SyntheticEvent) => void;
    onBlur?: (event: React.SyntheticEvent) => void;
    onFocus?: (event: React.SyntheticEvent) => void;
    width: string | number;
};

type HintState = {
    hintValue: string | null | undefined;
    hintClip: number | null | undefined;
};

type FilteredInputState = {
    displayValue: string | null | undefined;
} & HintState;

export default class FilteredInput<T> extends React.Component<
    FilteredInputProps<T>,
    FilteredInputState
> {
    innerInputRef?: React.RefObject<Input> | null;
    testWidthRef?: React.RefObject<HTMLDivElement> | null;
    rootRef?: React.RefObject<HTMLSpanElement> | null;

    state: FilteredInputState = {
        displayValue: null,
        hintValue: null,
        hintClip: null,
    };

    UNSAFE_componentWillMount(): void {
        this.reformatValueForView(this.props.value);
    }

    componentDidMount(): void {
        this.reformatValueForView(this.props.value);
    }

    UNSAFE_componentWillReceiveProps(nextProps: FilteredInputProps<T>): void {
        if (nextProps.value !== this.props.value) {
            if (!this.focused) {
                this.reformatValueForView(nextProps.value);
            }
        }
    }

    render(): React.ReactElement {
        const {
            value: _value,
            filterValue: _filterValue,
            valueForView: _valueForView,
            valueForEdit: _valueForEdit,
            hintForView: _hintForView,
            hintForEdit: _hintForEdit,
            onKeyDown,
            onBlur,
            onFocus,
            ...restProps
        } = this.props;
        const { hintClip } = this.state;
        return (
            <span className={cn("root")} ref={this.rootRef}>
                <div className={cn("test-width")} ref={this.testWidthRef} />
                {this.state.hintValue && hintClip !== null && hintClip !== undefined && (
                    <div
                        className={cn("hint-container")}
                        style={{ clip: `rect(auto,${hintClip}px,auto,0px)` }}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <Input
                            {...restProps}
                            disabled
                            borderless
                            placeholder={this.state.hintValue ? this.state.hintValue : ""}
                            value=""
                        />
                    </div>
                )}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Input
                    {...restProps}
                    ref={this.innerInputRef}
                    value={this.state.displayValue || ""}
                    onValueChange={(value) => this.handleInputChange(value)} // I suggested to rename properties from on*Change to on*ChangeHandler which not about DOM Events to make understandable that its not React event handler. (I know its component from kontur library but we can change same in moira components)
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

    handleInputChange(value: string): void {
        const { onChange, filterValue } = this.props;
        const filteredValue = filterValue(value);
        if (filteredValue !== null) {
            this.setState({
                hintClip: undefined,
                hintValue: undefined,
                displayValue: filteredValue.displayValue,
                ...this.getHintState(filteredValue.hintValue, filteredValue.displayValue),
            });
            onChange(filteredValue.actualValue);
        } else if (this.innerInputRef != null) {
            this.setState({}, () => {
                this.innerInputRef?.current?.setSelectionRange(
                    this.selectionStart ?? 0,
                    this.selectionEnd ?? 0
                );
            });
        }
    }

    handleBlur(event: React.SyntheticEvent): void {
        const displayValueForEdit = this.props.valueForEdit(this.props.value);
        const nextDisplayValue = this.props.valueForView(this.props.value);
        this.setState({
            hintClip: undefined,
            hintValue: undefined,
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

    reformatValueForEdit(value: T): void {
        if (this.state.displayValue !== this.props.valueForEdit(value)) {
            this.setState({
                hintClip: undefined,
                hintValue: undefined,
                displayValue: this.props.valueForEdit(value),
                ...this.getEditHintState(value),
            });
        }
    }

    reformatValueForView(value: T): void {
        if (this.state.displayValue !== this.props.valueForView(value)) {
            this.setState({
                hintClip: undefined,
                hintValue: undefined,
                displayValue: this.props.valueForView(value),
                ...this.getViewHintState(value),
            });
        }
    }

    getClip(value: string | null | undefined): number {
        if (this.testWidthRef != null && this.rootRef != null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.testWidthRef.current?.innerHTML = value || "";
            const result =
                (this.rootRef.current?.offsetWidth ?? 0) -
                (this.testWidthRef.current?.offsetWidth ?? 0);
            // TODO fix magic digits
            return result - 9;
        }
        return 0;
    }

    getEditHintState(value: T): Partial<HintState> {
        const { hintForEdit, valueForEdit } = this.props;
        if (hintForEdit === null || hintForEdit === undefined) {
            return {};
        }
        return {
            hintValue: hintForEdit(value),
            hintClip: this.getClip(valueForEdit(value)),
        };
    }

    getViewHintState(value: T): Partial<HintState> {
        const { hintForView, valueForView } = this.props;
        if (hintForView === null || hintForView === undefined) {
            return {};
        }
        return {
            hintValue: hintForView(value),
            hintClip: this.getClip(valueForView(value)),
        };
    }

    getHintState(
        hintValue: string | null | undefined,
        displayValue: string | null | undefined
    ): Partial<HintState> | null | undefined {
        if (hintValue === null || hintValue === undefined) {
            return null;
        }
        return {
            hintValue,
            hintClip: this.getClip(displayValue),
        };
    }

    focused = false;

    selectionStart: number | null = 0;

    selectionEnd: number | null = 0;
}
