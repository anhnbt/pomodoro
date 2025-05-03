import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { setMode } from '../redux/settingsSlice';
import { POMODORO, SHORT_BREAK, LONG_BREAK } from '../constants/appConfig';
import { sendNotification } from '../utils/notifications';
import { updateTitle, isMobileDevice } from '../utils/helperFunctions';
import { useDispatch } from 'react-redux';
import { useHandleTimerEnd } from '../utils/timerHooks';

const Timer = (
  {
    pomodoroTime,
    longBreakTime,
    shortBreakTime,
    autoStartPomodoroEnabled,
    autoStartEnabled,
    handleResetClick,
    handleAutoStart,
    isRunning,
    mode,
    alarmAudio,
    tickingAudio,
    onTimerEnd,
  },
  ref
) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Tính toán thời gian ban đầu một lần duy nhất khi component mount
    return mode === POMODORO
      ? pomodoroTime * 60
      : mode === SHORT_BREAK
      ? shortBreakTime * 60
      : longBreakTime * 60;
  });

  const [progressBarValue, setProgressBarValue] = useState(0);
  const intervalRef = useRef(null);
  const totalTimeRef = useRef(null);

  // Sử dụng useMemo để tính toán tổng thời gian và tránh tính toán lại không cần thiết
  const totalTime = useMemo(() => {
    const time =
      mode === POMODORO
        ? pomodoroTime * 60
        : mode === SHORT_BREAK
        ? shortBreakTime * 60
        : longBreakTime * 60;

    totalTimeRef.current = time;
    return time;
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  // Cập nhật tiêu đề tài liệu mỗi khi thời gian thay đổi
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    updateTitle(minutes, seconds, mode);
  }, [timeLeft, mode]);

  // Tính toán giá trị progress một cách hiệu quả
  const calculateProgress = useCallback(() => {
    return ((totalTimeRef.current - timeLeft) / totalTimeRef.current) * 100;
  }, [timeLeft]);

  useEffect(() => {
    setProgressBarValue(calculateProgress());
  }, [timeLeft, calculateProgress]);

  // Cải thiện logic đếm ngược bằng cách sử dụng requestAnimationFrame
  // để có animation mượt mà hơn và hiệu suất tốt hơn
  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    let lastTime = Date.now();

    const tick = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;

      if (deltaTime >= 1000) {
        lastTime = now - (deltaTime % 1000);

        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            cancelAnimationFrame(intervalRef.current);
            intervalRef.current = null;
            onTimerEnd();
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }

      intervalRef.current = requestAnimationFrame(tick);
    };

    intervalRef.current = requestAnimationFrame(tick);
  }, [onTimerEnd]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();

    setTimeLeft(totalTime);
    setProgressBarValue(0);
  }, [totalTime, pauseTimer]);

  // Cập nhật timeLeft khi mode hoặc thời gian thay đổi
  useEffect(() => {
    resetTimer();
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime, resetTimer]);

  // Cung cấp phương thức cho parent component
  useEffect(() => {
    ref.current = {
      start: startTimer,
      pause: pauseTimer,
      reset: resetTimer,
    };

    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current);
      }
    };
  }, [startTimer, pauseTimer, resetTimer, ref]);

  return (
    <CircularProgressWithLabel
      minutes={Math.floor(timeLeft / 60)}
      seconds={timeLeft % 60}
      variant="determinate"
      value={progressBarValue}
    />
  );
};

export default React.memo(forwardRef(Timer));
