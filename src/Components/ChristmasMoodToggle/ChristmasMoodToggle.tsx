import React, { FC } from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import { useChristmasMood } from "../../hooks/useChristmasMood";
import { useAppDispatch } from "../../store/hooks";
import { toggleChristmasMood } from "../../store/Reducers/UIReducer.slice";

export const ChristmasMoodToggle: FC = () => {
    const dispatch = useAppDispatch();
    const [isChristmasMood, setChristmasMood] = useChristmasMood();

    const handleToggleChristmasMood = (selected: boolean) => {
        setChristmasMood(selected);
        dispatch(toggleChristmasMood(selected));
    };
    return (
        <Toggle checked={isChristmasMood} onValueChange={handleToggleChristmasMood}>
            <span style={{ color: "#fff" }}>New Year mood</span>
        </Toggle>
    );
};
