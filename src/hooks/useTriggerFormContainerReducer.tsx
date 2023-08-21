import { useReducer } from "react";
import { ValidateTriggerResult } from "../Domain/Trigger";

export type State = {
    isLoading: boolean;
    isSaveModalVisible: boolean;
    isSaveButtonDisabled: boolean;
    validationResult?: ValidateTriggerResult;
    error: string | null;
};

export enum ActionType {
    setIsLoading = "setIsLoading",
    setIsSaveButtonDisabled = "setIsSaveButtonDisabled",
    setIsSaveModalVisible = "setIsSaveModalVisible",
    setValidationResult = "setValidationResult",
    setError = "setError",
    resetTargetValidationState = "resetTargetValidationState",
}

export type Action = {
    type: ActionType;
    payload: State[keyof State];
};

const initialState: State = {
    isLoading: false,
    isSaveModalVisible: false,
    isSaveButtonDisabled: false,
    validationResult: undefined,
    error: null,
};

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case ActionType.setIsLoading:
            return { ...state, isLoading: payload };
        case ActionType.setIsSaveButtonDisabled:
            return { ...state, isSaveButtonDisabled: payload };
        case ActionType.setIsSaveModalVisible:
            return { ...state, isSaveModalVisible: payload };
        case ActionType.setValidationResult:
            return { ...state, validationResult: payload };
        case ActionType.setError:
            return { ...state, error: payload };
        case ActionType.resetTargetValidationState: {
            const newTargets = state.validationResult?.targets.toSpliced(payload, 1) ?? [];
            return { ...state, validationResult: { targets: newTargets } };
        }
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
};

export const useTriggerFormContainerReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return [state, dispatch];
};
