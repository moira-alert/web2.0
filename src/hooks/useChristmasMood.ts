import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { useFeatureFlag, TFeatureFlag } from "./useFeatureFlag";
import { toggleChristmasMood } from "../store/Reducers/UIReducer.slice";
import { useSelector } from "react-redux";
import { selectIsChristmasMood } from "../store/Reducers/ConfigReducer.slice";

export const christmasMoodFlag: TFeatureFlag<boolean> = {
    id: "christmas_mood",
    label: "Christmas Mood",
    defaultValue: true,
};

export const useChristmasMood = () => {
    const dispatch = useAppDispatch();
    const { isChristmasMood: moodFromStore } = useAppSelector(UIState);
    const isChristmasMoodApiff = useSelector(selectIsChristmasMood);

    const [localChristmasMood, setLocalChristmasMood] = useFeatureFlag<boolean>(
        christmasMoodFlag,
        isChristmasMoodApiff
    );

    useEffect(() => {
        if (localChristmasMood !== moodFromStore && isChristmasMoodApiff) {
            dispatch(toggleChristmasMood(localChristmasMood));
        }
    }, [localChristmasMood, moodFromStore, isChristmasMoodApiff]);

    return [localChristmasMood, setLocalChristmasMood] as const;
};
