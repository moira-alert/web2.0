import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidateTargetsResult } from "../../Domain/Trigger";

interface State {
    isSaveModalVisible: boolean;
    isSaveButtonDisabled: boolean;
    validationResult?: ValidateTargetsResult;
}

const initialState: State = {
    isSaveModalVisible: false,
    isSaveButtonDisabled: false,
    validationResult: undefined,
};

export const triggerFormSlice = createSlice({
    name: "triggerForm",
    initialState,
    reducers: {
        setIsSaveButtonDisabled: (state, action: PayloadAction<boolean>) => {
            state.isSaveButtonDisabled = action.payload;
        },
        setIsSaveModalVisible: (state, action: PayloadAction<boolean>) => {
            state.isSaveModalVisible = action.payload;
        },
        setValidationResult: (state, action: PayloadAction<ValidateTargetsResult>) => {
            state.validationResult = action.payload;
        },
    },
});

export const {
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
    setValidationResult,
} = triggerFormSlice.actions;

export default triggerFormSlice.reducer;
