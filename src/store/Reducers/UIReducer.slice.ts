import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IUIState {
    isLoading: boolean;
    error: string;
}

const initialState: IUIState = {
    isLoading: false,
    error: "",
};

export const UISlice = createSlice({
    name: "uiReducer",
    initialState,
    reducers: {
        toggleLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { toggleLoading, setError } = UISlice.actions;

export default UISlice.reducer;
