import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type TFeatureFlag<T> = {
    id: string;
    label: string;
    defaultValue: T;
};

export const useFeatureFlag = <T>(
    featureFlag: TFeatureFlag<T>,
    shouldPersist: boolean = true
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
        if (!shouldPersist) {
            window.localStorage.removeItem(key);
            return;
        }
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value, shouldPersist]);

    return [value, setValue];
};
