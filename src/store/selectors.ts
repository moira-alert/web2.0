import { RootState } from "./store";

export const UIState = (state: RootState) => state.UIReducer;
export const ConfigState = (state: RootState) => state.ConfigReducer;
export const TriggerFormState = (state: RootState) => state.TriggerFormReducer;
export const NotificationFiltersState = (state: RootState) => state.NotificationFiltersReducer;
