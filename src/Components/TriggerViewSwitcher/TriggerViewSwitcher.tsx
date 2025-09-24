import React from "react";
import { Switcher } from "@skbkontur/react-ui";
import { EMainPageTriggerView } from "../../store/Reducers/UIReducer.slice";
import { useMainPageTriggerView } from "../../hooks/useMainPageTiggerView";

interface ITriggerViewSwitcherProps {
    className?: string;
}

export const TriggerViewSwitcher: React.FC<ITriggerViewSwitcherProps> = ({ className }) => {
    const [triggerView, setTriggerView] = useMainPageTriggerView();

    const handleChange = (value: string) => {
        setTriggerView(value as EMainPageTriggerView);
    };

    return (
        <Switcher
            className={className}
            value={triggerView}
            onValueChange={handleChange}
            items={Object.values(EMainPageTriggerView)}
        />
    );
};
