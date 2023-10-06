import React, { createRef } from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import classNames from "classnames/bind";

import styles from "./FilteredInput.less";

const cn = classNames.bind(styles);

export type FilterValueResult<T> = {
    hintValue?: string;
    displayValue: string | null;
    actualValue: T;
};

type FilteredInputProps<T> = {
    value: T;
    align?: "left" | "center" | "right";
    disabled?: boolean;
    width: string | number;
    onChange: (value: T) => void;
    filterValue: (value: string) => FilterValueResult<T> | null;
    valueForView: (value: T) => string;
    valueForEdit: (value: T) => string;
    hintForView?: (value: T) => string | null;
    hintForEdit?: (value: T) => string | null;
    onKeyDown?: (event: React.SyntheticEvent) => void;
    onBlur?: (event: React.SyntheticEvent) => void;
    onFocus?: (event: React.SyntheticEvent) => void;
    error?: boolean;
    warning?: boolean;
    "data-tid"?: string;
};

type HintState = {
    hintValue?: string | null;
    hintClip?: number | null;
};

type FilteredInputState = {
    displayValue?: string | null;
} & HintState;

export default class FilteredInput<T> extends React.Component<
    FilteredInputProps<T>,
    FilteredInputState
> {
    public state: FilteredInputState = {
        displayValue: null,
        hintValue: null,
        hintClip: null,
    };
    private innerInputRef = createRef<Input>();
    private testWidthRef = createRef<HTMLDivElement>();
    private rootRef = createRef<HTMLSpanElement>();

    private focused = false;
    private selectionStart: number | null = 0;
    private selectionEnd: number | null = 0;

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
        const { onKeyDown, onBlur, onFocus } = this.props;
        const { hintClip } = this.state;

        return (
            <span className={cn("root")} ref={this.rootRef}>
                <div className={cn("test-width")} ref={this.testWidthRef} />
                {this.state.hintValue && hintClip != null && (
                    <div
                        className={cn("hint-container")}
                        style={{ clip: `rect(auto,${hintClip}px,auto,0px)` }}
                    >
                        <Input
                            disabled
                            borderless
                            placeholder={this.state.hintValue ?? ""}
                            value=""
                            align={this.props.align}
                            width={this.props.width}
                            data-tid={this.props["data-tid"]}
                        />
                    </div>
                )}
                <Input
                    ref={this.innerInputRef}
                    value={this.state.displayValue ?? ""}
                    align={this.props.align}
                    disabled={this.props.disabled}
                    error={this.props.error}
                    warning={this.props.warning}
                    width={this.props.width}
                    onValueChange={(value) => this.handleInputChange(value)} // I suggested to rename properties from on*Change to on*ChangeHandler which not about DOM Events to make understandable that its not React event handler. (I know its component from kontur library but we can change same in moira components)
                    onBlur={(event, ...rest) => {
                        this.focused = false;
                        this.handleBlur(event);
                        onBlur?.(event, ...rest);
                    }}
                    onFocus={(event, ...rest) => {
                        this.focused = true;
                        this.reformatValueForEdit(this.props.value);
                        onFocus?.(event, ...rest);
                    }}
                    onKeyDown={(event, ...rest) => {
                        const target = event.target;
                        if (target instanceof HTMLInputElement) {
                            this.selectionStart = target.selectionStart;
                            this.selectionEnd = target.selectionEnd;
                            onKeyDown?.(event, ...rest);
                        }
                    }}
                    data-tid={this.props["data-tid"]}
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
        } else {
            this.setState({}, () => {
                this.innerInputRef.current?.setSelectionRange(
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

        this.props.onBlur?.(event);
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

    getClip(value?: string | null): number {
        if (this.testWidthRef.current && this.rootRef) {
            this.testWidthRef.current.innerHTML = value ?? "";
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
        if (hintForEdit == null) {
            return {};
        }
        return {
            hintValue: hintForEdit(value),
            hintClip: this.getClip(valueForEdit(value)),
        };
    }

    getViewHintState(value: T): Partial<HintState> {
        const { hintForView, valueForView } = this.props;
        if (hintForView == null) {
            return {};
        }
        return {
            hintValue: hintForView(value),
            hintClip: this.getClip(valueForView(value)),
        };
    }

    private getHintState(
        hintValue?: string | null,
        displayValue?: string | null
    ): Partial<HintState> | undefined {
        if (hintValue == null) {
            return undefined;
        }
        return {
            hintValue,
            hintClip: this.getClip(displayValue),
        };
    }
}
