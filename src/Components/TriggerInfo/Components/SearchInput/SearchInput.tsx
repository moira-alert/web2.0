import { FC } from "react";
import { IconSearchLoupeRegular16 } from "@skbkontur/icons/IconSearchLoupeRegular16";
import { IconXCircleRegular16 } from "@skbkontur/icons/IconXCircleRegular16";
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
        leftIcon={<IconSearchLoupeRegular16 />}
        rightIcon={<IconXCircleRegular16 style={{ cursor: "pointer" }} onClick={onClear} />}
        onValueChange={onValueChange}
        value={value}
    />
);
