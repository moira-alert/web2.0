import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TFeatureFlag } from "./useThemeFeature";

export const useFeatureFlag = <T>(
    featureFlag: TFeatureFlag<T>
): [T, Dispatch<SetStateAction<T>>] => {
    const key = `ff_${featureFlag.id}`;

    const [value, setValue] = useState<T>(() => {
        const localValue = window.localStorage.getItem(key);
        if (!localValue) {
            return featureFlag.defaultValue;
        }
        try {
            return JSON.parse(localValue);
        } catch (e) {
            return localValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};
