import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
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
    onTimerEnd, // New prop to handle timer end externally
  },
  ref
) => {
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60); // Store time in seconds
  const [progressBarValue, setProgressBarValue] = useState(0);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  const calculateProgress = useCallback(() => {
    const totalTime =
      mode === POMODORO
        ? pomodoroTime * 60
        : mode === SHORT_BREAK
        ? shortBreakTime * 60
        : longBreakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  }, [timeLeft, mode, pomodoroTime, shortBreakTime, longBreakTime]);

  useEffect(() => {
    setProgressBarValue(calculateProgress());
  }, [timeLeft, calculateProgress]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return; // Prevent multiple intervals

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onTimerEnd();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  }, [onTimerEnd]);

  const pauseTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    const initialTime =
      mode === POMODORO
        ? pomodoroTime * 60
        : mode === SHORT_BREAK
        ? shortBreakTime * 60
        : longBreakTime * 60;
    setTimeLeft(initialTime);
    setProgressBarValue(0);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  useEffect(() => {
    ref.current = { start: startTimer, pause: pauseTimer, reset: resetTimer };
    return () => clearInterval(intervalRef.current);
  }, [startTimer, pauseTimer, resetTimer, ref]);

  useEffect(() => {
    const initialTime =
      mode === POMODORO
        ? pomodoroTime * 60
        : mode === SHORT_BREAK
        ? shortBreakTime * 60
        : longBreakTime * 60;
    setTimeLeft(initialTime);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  return (
    <CircularProgressWithLabel
      minutes={Math.floor(timeLeft / 60)}
      seconds={timeLeft % 60}
      variant="determinate"
      value={progressBarValue}
    />
  );
};

export default forwardRef(Timer);
