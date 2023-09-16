// modeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
    POMODORO
  } from "../constants/appConfig";

const modeSlice = createSlice({
  name: 'mode',
  initialState: POMODORO, // Giá trị mặc định cho biến mode
  reducers: {
    setMode: (state, action) => {
      return action.payload;
    },
  },
});

export const { setMode } = modeSlice.actions;
export default modeSlice.reducer;
