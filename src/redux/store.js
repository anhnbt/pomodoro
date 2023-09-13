// store.js

import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice.js';
import modeReducer from './modeSlice.js';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    mode: modeReducer,
    // Thêm reducers của các slice khác nếu có
  },
});

export default store;
