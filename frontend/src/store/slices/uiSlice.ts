import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  assistantOpen: boolean;
}

const initialState: UiState = { assistantOpen: false };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAssistant: (state) => {
      state.assistantOpen = true;
    },
    closeAssistant: (state) => {
      state.assistantOpen = false;
    },
  },
});

export const { openAssistant, closeAssistant } = uiSlice.actions;
export default uiSlice.reducer;
