// settingsSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_POMODORO_TIME,
  DEFAULT_SHORT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  ALARM_BELL,
  ALARM_BIRD,
  ALARM_DIGITAL,
  ALARM_KITCHEN,
  ALARM_WOOD,
  TICKING_FAST,
  TICKING_SLOW,
  WHITE_NOISE,
  BROWN_NOISE,
} from "../constants";

const initialState = {
  pomodoroTime: DEFAULT_POMODORO_TIME, // Giá trị mặc định cho thời gian Pomodoro (minutes)
  volume: 0.5, // Giá trị mặc định cho âm lượng (từ 0 đến 1)
  shortBreakTime: DEFAULT_SHORT_BREAK_TIME, // Giá trị mặc định cho thời gian nghỉ ngắn (minutes)
  longBreakTime: DEFAULT_LONG_BREAK_TIME, // Giá trị mặc định cho thời gian nghỉ dài (minutes)
  alarmSound: 'ALARM_DIGITAL', // Giá trị mặc định cho loại âm thanh báo động
  tickingSound: 'TICKING_NONE', // Giá trị mặc định cho loại âm thanh đồng hồ
  hourFormat: "12", // Giá trị mặc định cho định dạng giờ (12 hoặc 24)
  autoStartPomodoroEnabled: false, // Tự động bắt đầu Pomodoro khi ứng dụng mở
  autoStartEnabled: false, // Tự động bắt đầu khi kết thúc Pomodoro hoặc nghỉ
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setPomodoroTime: (state, action) => {
      state.pomodoroTime = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setShortBreakTime: (state, action) => {
      state.shortBreakTime = action.payload;
    },
    setLongBreakTime: (state, action) => {
      state.longBreakTime = action.payload;
    },
    setAlarmSound: (state, action) => {
      state.alarmSound = action.payload;
    },
    setTickingSound: (state, action) => {
      state.tickingSound = action.payload;
    },
    setHourFormat: (state, action) => {
      state.hourFormat = action.payload;
    },
    setAutoStartPomodoroEnabled: (state, action) => {
      state.autoStartPomodoroEnabled = action.payload;
    },
    setAutoStartEnabled: (state, action) => {
      state.autoStartEnabled = action.payload;
    },
  },
});

export const {
  setPomodoroTime,
  setVolume,
  setShortBreakTime,
  setLongBreakTime,
  setAlarmSound,
  setTickingSound,
  setHourFormat,
  setAutoStartPomodoroEnabled,
  setAutoStartEnabled,
} = settingsSlice.actions;

export default settingsSlice.reducer;