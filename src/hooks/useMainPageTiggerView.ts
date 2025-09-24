import { toggleMainPageTriggerView, EMainPageTriggerView } from "../store/Reducers/UIReducer.slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";

export const useMainPageTriggerView = (): [
    EMainPageTriggerView,
    (value: EMainPageTriggerView) => void
] => {
    const { mainPageTriggerView } = useAppSelector(UIState);
    const dispatch = useAppDispatch();

    const setTriggerView = (value: string) => {
        dispatch(toggleMainPageTriggerView(value as EMainPageTriggerView));
    };

    return [mainPageTriggerView, setTriggerView];
};
