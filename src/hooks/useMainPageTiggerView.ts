import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleMainPageTriggerView, EMainPageTriggerView } from "../store/Reducers/UIReducer.slice";
import { useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { TFeatureFlag, useFeatureFlag } from "./useFeatureFlag";

export const triggerViewFlag: TFeatureFlag<EMainPageTriggerView> = {
    id: "trigger_view",
    label: "Trigger view",
    defaultValue: EMainPageTriggerView.target,
};

export const useMainPageTriggerView = (): [
    EMainPageTriggerView,
    (value: EMainPageTriggerView) => void
] => {
    const dispatch = useDispatch();
    const { mainPageTriggerView: triggerViewFromStore } = useAppSelector(UIState);
    const [triggerViewFromStorage, setTriggerViewInStorage] = useFeatureFlag(triggerViewFlag);

    useEffect(() => {
        if (triggerViewFromStorage && triggerViewFromStore !== triggerViewFromStorage) {
            dispatch(toggleMainPageTriggerView(triggerViewFromStorage));
        }
    }, [triggerViewFromStorage, triggerViewFromStore]);

    const setTriggerView = (value: EMainPageTriggerView) => {
        dispatch(toggleMainPageTriggerView(value));
        setTriggerViewInStorage(value);
    };

    return [triggerViewFromStore, setTriggerView];
};
