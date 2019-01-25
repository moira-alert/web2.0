// @flow
/* eslint-disable */
import * as React from "react";
import numeral from "numeral";
import FilteredInput from "../FilteredInput/FilteredInput";
import type { FilterValueResult } from "../FilteredInput/FilteredInput";

type FormattedNumberInputProps = {
    viewFormat?: ?string,
    editFormat?: ?string,
    value: ?number,
    align?: "left" | "center" | "right",
    onChange: (event: SyntheticEvent<>, value: ?number) => any,
    width: string | number,
};

export default class FormattedNumberInput extends React.Component<FormattedNumberInputProps> {
    props: FormattedNumberInputProps;

    static numberRegexp = /^\-?\s*\d*(\.\d*)?\s*$/;

    handleFilterValue(value: string): FilterValueResult<?number> | null {
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

    handleValueForView(value: ?number): string {
        return value != null
            ? numeral(value).format(this.props.viewFormat || this.props.editFormat || "0.0[00000]")
            : "";
    }

    handleValueForEdit(value: ?number): string {
        return value != null ? numeral(value).format(this.props.editFormat || "0.0[00000]") : "";
    }

    render(): React.Node {
        // eslint-disable-next-line no-unused-vars
        const {
            value,
            viewFormat: _viewFormat,
            editFormat: _editFormat,
            ...restProps
        } = this.props;
        return (
            <FilteredInput
                ref="filteredInput"
                {...restProps}
                value={value}
                filterValue={value => this.handleFilterValue(value)}
                valueForView={value => this.handleValueForView(value)}
                valueForEdit={value => this.handleValueForEdit(value)}
            />
        );
    }
}
