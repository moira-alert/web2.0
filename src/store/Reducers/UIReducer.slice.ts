import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Subscription } from "../../Domain/Subscription";

interface IUIState {
    isLoading: boolean;
    error: string | null;
    isNewFrontendVersionAvailable: boolean;
    isTransferringSubscriptions: boolean;
    transferingSubscriptions: Subscription[];
}

const initialState: IUIState = {
    isLoading: false,
    error: null,
    isNewFrontendVersionAvailable: false,
    isTransferringSubscriptions: false,
    transferingSubscriptions: [],
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
        setIsTransferringSubscriptions: (state, action: PayloadAction<boolean>) => {
            state.isTransferringSubscriptions = action.payload;
        },
        setTransferingSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
            state.transferingSubscriptions = action.payload;
        },
        addSubscriptionToTransfer: (state, action: PayloadAction<Subscription>) => {
            if (!state.transferingSubscriptions.includes(action.payload)) {
                state.transferingSubscriptions.push(action.payload);
            }
        },
        removeSubscriptionFromTransfer: (state, action: PayloadAction<string>) => {
            const index = state.transferingSubscriptions.findIndex(
                (subscription) => subscription.id === action.payload
            );
            if (index !== -1) {
                state.transferingSubscriptions.splice(index, 1);
            }
        },
        toggleSubscriptionTransfer: (state, action: PayloadAction<Subscription>) => {
            const existingIndex = state.transferingSubscriptions.findIndex(
                (subscription) => subscription.id === action.payload.id
            );
            if (existingIndex !== -1) {
                state.transferingSubscriptions.splice(existingIndex, 1);
            } else {
                state.transferingSubscriptions.push(action.payload);
            }
        },
    },
});

export const {
    toggleLoading,
    setError,
    updateServiceWorker,
    setIsTransferringSubscriptions,
    setTransferingSubscriptions,
    addSubscriptionToTransfer,
    removeSubscriptionFromTransfer,
    toggleSubscriptionTransfer,
} = UISlice.actions;

export default UISlice.reducer;
