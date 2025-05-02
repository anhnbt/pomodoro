import { useCallback } from 'react';
import { POMODORO, SHORT_BREAK } from '../constants/appConfig';
import { addStatistics } from '../redux/settingsSlice';

export const useHandleTimerEnd = ({
  alarmAudio,
  tickingAudio,
  handleResetClick,
  handleAutoStart,
  autoStartEnabled,
  autoStartPomodoroEnabled,
  mode,
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  dispatch,
}) => {
  return useCallback(() => {
    console.log('Timer ended!');
    alarmAudio.play();
    tickingAudio.stop();
    handleResetClick();
    console.log(mode, 'mode');

    const completedSession = {
      mode,
      duration:
        mode === POMODORO
          ? pomodoroTime
          : mode === SHORT_BREAK
          ? shortBreakTime
          : longBreakTime,
      timestamp: new Date().toISOString(),
    };
    console.log('completedSession', completedSession);
    // Defer dispatch to avoid update during render cycle
    setTimeout(() => {
      dispatch(addStatistics(completedSession));
    }, 0);

    if (autoStartEnabled || (mode === POMODORO && autoStartPomodoroEnabled)) {
      handleAutoStart();
    }
  }, [
    alarmAudio,
    tickingAudio,
    handleResetClick,
    handleAutoStart,
    autoStartEnabled,
    autoStartPomodoroEnabled,
    mode,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    dispatch,
  ]);
};
