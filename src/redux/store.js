// store.js

import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice.js';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    // Thêm reducers của các slice khác nếu có
  },
});

export default store;
