import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface INotificationFiltersState {
    filteredCount: number;
}

const initialState: INotificationFiltersState = {
    filteredCount: 0,
};

export const notificationFiltersSlice = createSlice({
    name: "notificationFilters",
    initialState,
    reducers: {
        setFilteredCount: (state, action: PayloadAction<number>) => {
            state.filteredCount = action.payload;
        },
    },
});

export const { setFilteredCount } = notificationFiltersSlice.actions;
export default notificationFiltersSlice.reducer;
