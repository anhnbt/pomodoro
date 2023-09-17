import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice.js";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

export default store;
