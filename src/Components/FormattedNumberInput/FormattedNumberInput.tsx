import * as React from "react";
import numeral from "numeral";
import FilteredInput from "../FilteredInput/FilteredInput";
import { FilterValueResult } from "../FilteredInput/FilteredInput";

type FormattedNumberInputProps = {
    viewFormat?: string | null;
    editFormat?: string | null;
    value: number | null;
    align?: "left" | "center" | "right";
    onChange: (value: number | null) => void;
    width: string | number;
};

export default class FormattedNumberInput extends React.Component<FormattedNumberInputProps> {
    render(): React.ReactElement {
        const {
            value,
            viewFormat: _viewFormat,
            editFormat: _editFormat,
            ...restProps
        } = this.props;
        // FIXME убрал строковый ref="filteredInput" не знаю как это раньше работало
        return (
            <FilteredInput<number | null>
                {...restProps}
                value={value}
                filterValue={(value) => this.handleFilterValue(value)}
                valueForView={(value) => this.handleValueForView(value)}
                valueForEdit={(value) => this.handleValueForEdit(value)}
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

    handleValueForView(value: number | null | undefined): string {
        return value != null
            ? numeral(value).format(this.props.viewFormat || this.props.editFormat || "0.0[00000]")
            : "";
    }

    handleValueForEdit(value: number | null | undefined): string {
        return value != null ? numeral(value).format(this.props.editFormat || "0.0[00000]") : "";
    }

    static numberRegexp = /^-?\s*\d*(\.\d*)?\s*$/;
}
