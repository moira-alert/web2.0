import * as React from "react";
import numeral from "numeral";
import FilteredInput from "../FilteredInput/FilteredInput";
import { FilterValueResult } from "../FilteredInput/FilteredInput";

type FormattedNumberInputProps = {
    viewFormat?: string | null;
    editFormat?: string | null;
    value: number | null;
    align?: "left" | "center" | "right";
    disabled?: boolean;
    onChange: (value: number | null) => void;
    width: string | number;
    "data-tid"?: string;
};

export default class FormattedNumberInput extends React.Component<FormattedNumberInputProps> {
    render(): React.ReactElement {
        const { value } = this.props;

        return (
            <FilteredInput<number | null>
                value={value}
                align={this.props.align}
                disabled={this.props.disabled}
                width={this.props.width}
                onChange={this.props.onChange}
                filterValue={(value) => this.handleFilterValue(value)}
                valueForView={(value) => this.handleValueForView(value)}
                valueForEdit={(value) => this.handleValueForEdit(value)}
                data-tid={this.props["data-tid"]}
            />
        );
    }

    handleFilterValue(value: string): FilterValueResult<number | null> | null {
        const str = value ? value.replace(",", ".") : value;

        if (FormattedNumberInput.numberRegexp.test(str)) {
            if (str.trim() === "") {
                return {
                    displayValue: null,
                    actualValue: null,
                };
            }
            return {
                displayValue: str,
                actualValue: parseFloat(str),
            };
        }
        return null;
    }

    handleValueForView(value?: number | null): string {
        return value != null
            ? numeral(value).format(this.props.viewFormat || this.props.editFormat || "0.0[00000]")
            : "";
    }

    handleValueForEdit(value?: number | null): string {
        return value != null ? numeral(value).format(this.props.editFormat || "0.0[00000]") : "";
    }

    static numberRegexp = /^-?\s*\d*(\.\d*)?\s*$/;
}
