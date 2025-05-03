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

    // Notify user if page is not visible
    if (document.hidden) {
      try {
        // Send browser notification when timer ends in background
        const notificationTitle =
          mode === POMODORO
            ? 'Thời gian tập trung kết thúc!'
            : 'Thời gian nghỉ kết thúc!';
        const notificationBody =
          mode === POMODORO ? 'Đã đến lúc nghỉ ngơi!' : 'Đã đến lúc tập trung!';

        if (Notification.permission === 'granted') {
          new Notification(notificationTitle, {
            body: notificationBody,
            icon: 'images/logo192.png',
          });
        }
      } catch (error) {
        console.error('Không thể hiển thị thông báo:', error);
      }
    }

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

// Thêm hook mới để theo dõi thay đổi khả năng hiển thị trang
export const usePageVisibility = (callback) => {
  useCallback(() => {
    const handleVisibilityChange = () => {
      callback(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
};
