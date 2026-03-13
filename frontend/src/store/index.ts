import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import tagsReducer from "./slices/tagsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    tags: tagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
