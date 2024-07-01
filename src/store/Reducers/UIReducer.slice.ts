import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IUIState {
    isLoading: boolean;
    error: string | null;
    isNewFrontendVersionAvailable: boolean;
}

const initialState: IUIState = {
    isLoading: false,
    error: null,
    isNewFrontendVersionAvailable: false,
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
        updateServiceWorker: (state) => {
            state.isNewFrontendVersionAvailable = true;
        },
    },
});

export const { toggleLoading, setError, updateServiceWorker } = UISlice.actions;

export default UISlice.reducer;
