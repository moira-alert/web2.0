import React, { FC } from "react";
import SearchIcon from "@skbkontur/react-icons/Search";
import Clear from "@skbkontur/react-icons/Clear";
import { Input } from "@skbkontur/react-ui/components/Input";

interface ISearchInputProps {
    value: string;
    placeholder?: string;
    width?: string | number;
    onClear: () => void;
    onValueChange: (value: string) => void;
}

export const SearchInput: FC<ISearchInputProps> = ({
    value,
    placeholder,
    width,
    onClear,
    onValueChange,
}) => (
    <Input
        placeholder={placeholder}
        width={width}
        leftIcon={<SearchIcon />}
        rightIcon={<Clear style={{ cursor: "pointer" }} onClick={onClear} />}
        onValueChange={onValueChange}
        value={value}
    />
);
