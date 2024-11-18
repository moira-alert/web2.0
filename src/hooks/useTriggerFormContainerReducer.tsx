import { useReducer } from "react";
import { ValidateTargetsResult } from "../Domain/Trigger";

export interface State {
    isSaveModalVisible: boolean;
    isSaveButtonDisabled: boolean;
    validationResult?: ValidateTargetsResult;
}

export enum ActionType {
    setIsSaveButtonDisabled = "setIsSaveButtonDisabled",
    setIsSaveModalVisible = "setIsSaveModalVisible",
    setValidationResult = "setValidationResult",
}

export const setIsSaveButtonDisabled = (payload: boolean): Action => ({
    type: ActionType.setIsSaveButtonDisabled,
    payload,
});
export const setIsSaveModalVisible = (payload: boolean): Action => ({
    type: ActionType.setIsSaveModalVisible,
    payload,
});
export const setValidationResult = (payload: ValidateTargetsResult): Action => ({
    type: ActionType.setValidationResult,
    payload,
});

export type Action =
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
          payload: ValidateTargetsResult;
      };

const initialState: State = {
    isSaveModalVisible: false,
    isSaveButtonDisabled: false,
    validationResult: undefined,
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.setIsSaveButtonDisabled:
            return { ...state, isSaveButtonDisabled: action.payload };
        case ActionType.setIsSaveModalVisible:
            return { ...state, isSaveModalVisible: action.payload };
        case ActionType.setValidationResult:
            return { ...state, validationResult: action.payload };
        default:
            throw new Error(`Unknown action: ${JSON.stringify(action)}`);
    }
};

export const useTriggerFormContainerReducer = () => useReducer(reducer, initialState);
