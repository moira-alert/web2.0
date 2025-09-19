import React from "react";
import { Switcher } from "@skbkontur/react-ui";
import { EMainPageTriggerView } from "../../store/Reducers/UIReducer.slice";
import { useMainPageTriggerView } from "../../hooks/useMainPageTiggerView";

interface ITriggerViewSwitcherProps {
    style?: React.CSSProperties;
}

export const TriggerViewSwitcher: React.FC<ITriggerViewSwitcherProps> = ({ style }) => {
    const [triggerView, setTriggerView] = useMainPageTriggerView();

    const handleChange = (value: string) => {
        setTriggerView(value as EMainPageTriggerView);
    };

    return (
        <Switcher
            style={style}
            value={triggerView}
            onValueChange={handleChange}
            items={Object.values(EMainPageTriggerView)}
        />
    );
};
