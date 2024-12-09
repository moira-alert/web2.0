import React, { FC } from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import { useChristmasMood } from "../../hooks/useChristmasMood";
import { useAppDispatch } from "../../store/hooks";
import { toggleChristmasMood } from "../../store/Reducers/UIReducer.slice";
import { useSelector } from "react-redux";
import { selectIsChristmasMood } from "../../store/Reducers/ConfigReducer.slice";

export const ChristmasMoodToggle: FC = () => {
    const dispatch = useAppDispatch();
    const [isChristmasMood, setChristmasMood] = useChristmasMood();
    const isChristmasMoodEnabled = useSelector(selectIsChristmasMood);

    const handleToggleChristmasMood = (selected: boolean) => {
        setChristmasMood(selected);
        dispatch(toggleChristmasMood(selected));
    };
    return (
        <>
            {isChristmasMoodEnabled ? (
                <Toggle checked={isChristmasMood} onValueChange={handleToggleChristmasMood}>
                    <span style={{ color: "#fff" }}>New Year mood</span>
                </Toggle>
            ) : null}
        </>
    );
};
