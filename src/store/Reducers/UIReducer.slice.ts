import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ButtonUse } from "@skbkontur/react-ui";

interface IUIState {
    isLoading: boolean;
    error: string;
    isModalOpen: boolean;
    modalData: TModalData;
}

export type TModalButton = {
    text: string;
    use?: ButtonUse;
};

export type TModalData = {
    header: string;
    body?: string | React.ReactNode;
    button?: TModalButton;
};

const initialState: IUIState = {
    isLoading: false,
    error: "",
    isModalOpen: false,
    modalData: {
        button: { text: "" },
        header: "",
    },
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
        toggleModal: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setModalData: (state, action: PayloadAction<TModalData>) => {
            state.modalData = action.payload;
        },
    },
});

export const { toggleLoading, toggleModal, setModalData, setError } = UISlice.actions;

export default UISlice.reducer;
