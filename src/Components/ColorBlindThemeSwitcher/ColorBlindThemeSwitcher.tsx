import type { FC } from "react";
import { Toggle } from "@skbkontur/react-ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { toggleColorBlindTheme } from "../../store/Reducers/UIReducer.slice";

interface ColorBlindThemeSwitcherProps {
    className?: string;
}

export const ColorBlindThemeSwitcher: FC<ColorBlindThemeSwitcherProps> = ({ className }) => {
    const { isColorBlindThemeOn } = useAppSelector(UIState);
    const dispatch = useAppDispatch();

    const setColorBlindTheme = (value: boolean) => {
        dispatch(toggleColorBlindTheme(value));
    };
    return (
        <Toggle
            className={className}
            checked={isColorBlindThemeOn}
            onValueChange={setColorBlindTheme}
        />
    );
};
