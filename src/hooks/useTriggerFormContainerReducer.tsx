import { useReducer } from "react";
import { ValidateTriggerResult } from "../Domain/Trigger";

export interface State {
    isLoading: boolean;
    isSaveModalVisible: boolean;
    isSaveButtonDisabled: boolean;
    validationResult?: ValidateTriggerResult;
    error?: string | null;
}

export enum ActionType {
    setIsLoading = "setIsLoading",
    setIsSaveButtonDisabled = "setIsSaveButtonDisabled",
    setIsSaveModalVisible = "setIsSaveModalVisible",
    setValidationResult = "setValidationResult",
    setError = "setError",
    resetTargetValidationState = "resetTargetValidationState",
}

export type Action =
    | {
          type: ActionType.setIsLoading;
          payload: boolean;
      }
    | {
          type: ActionType.setIsSaveButtonDisabled;
          payload: boolean;
      }
    | {
          type: ActionType.setIsSaveModalVisible;
          payload: boolean;
      }
    | {
          type: ActionType.setValidationResult;
          payload: ValidateTriggerResult;
      }
    | {
          type: ActionType.setError;
          payload: string | null;
      }
    | {
          type: ActionType.resetTargetValidationState;
          payload?: number;
      };

const initialState: State = {
    isLoading: false,
    isSaveModalVisible: false,
    isSaveButtonDisabled: false,
    validationResult: undefined,
    error: null,
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.setIsLoading:
            return { ...state, isLoading: action.payload };
        case ActionType.setIsSaveButtonDisabled:
            return { ...state, isSaveButtonDisabled: action.payload };
        case ActionType.setIsSaveModalVisible:
            return { ...state, isSaveModalVisible: action.payload };
        case ActionType.setValidationResult:
            return { ...state, validationResult: action.payload };
        case ActionType.setError:
            return { ...state, error: action.payload };
        case ActionType.resetTargetValidationState: {
            const newTargets =
                // @ts-ignore Здесь TS не видит метод toSpliced на массиве. А он есть.
                state.validationResult?.targets.toSpliced(action.payload, 1, undefined) ?? [];
            return { ...state, validationResult: { targets: newTargets } };
        }
        default:
            throw new Error(`Unknown action: ${JSON.stringify(action)}`);
    }
};

export const useTriggerFormContainerReducer = () => useReducer(reducer, initialState);
