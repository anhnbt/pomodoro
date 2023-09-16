import React, { useState, useEffect, forwardRef, useRef } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { setMode } from "../redux/modeSlice";
import { POMODORO, SHORT_BREAK, LONG_BREAK } from "../constants/appConfig";
import { sendNotification } from "../utils/notifications";

const Timer = (
  {
    pomodoroTime,
    longBreakTime,
    shortBreakTime,
    autoStartPomodoroEnabled,
    autoStartEnabled,
    handleResetClick,
    isRunning,
    mode,
    alarmAudio,
    tickingAudio,
  },
  ref
) => {
  const [minutes, setMinutes] = useState(pomodoroTime);
  const [seconds, setSeconds] = useState(0);
  const [progressBarValue, setProgressBarValue] = useState(0);
  // Biến để theo dõi thời gian còn lại
  const currentDurationRef = useRef(0);
  // Sử dụng một biến tham chiếu riêng để lưu interval
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleTimerEnd = () => {
      handleResetClick();
      switch (mode) {
        case POMODORO:
          sendNotification("Pomodoro kết thúc", "Hãy nghỉ ngắn 5 phút!");
          if (autoStartEnabled) {
            setMode(SHORT_BREAK); // Chuyển sang chế độ Short Break
            startTimer(); // Bắt đầu đếm ngược cho Short Break
          }
          break;
        case SHORT_BREAK:
          sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
          if (autoStartPomodoroEnabled) {
            setMode(POMODORO); // Chuyển lại chế độ Pomodoro
            startTimer(); // Bắt đầu đếm ngược cho Pomodoro
          }
          break;
        case LONG_BREAK:
          sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
          if (autoStartPomodoroEnabled) {
            setMode(POMODORO); // Chuyển lại chế độ Pomodoro
            startTimer(); // Bắt đầu đếm ngược cho Pomodoro
          }
          break;
        default:
          break;
      }
      alarmAudio.play();
      tickingAudio.stop();
    };

    const startTimer = () => {
      const updateTimer = (duration) => {
        setMinutes(Math.floor(duration / 60));
        setSeconds(duration % 60);
      };
      const handleCountdown = () => {
        let totalSecondsInMode;
        if (currentDurationRef.current > 0) {
          currentDurationRef.current -= 1;
          switch (mode) {
            case POMODORO:
              totalSecondsInMode = pomodoroTime * 60; // 25 phút cho Pomodoro
              break;
            case SHORT_BREAK:
              totalSecondsInMode = shortBreakTime * 60; // 5 phút cho Short Break
              break;
            case LONG_BREAK:
              totalSecondsInMode = longBreakTime * 60; // 15 phút cho Long Break
              break;
            default:
              break;
          }
          const progress =
            ((totalSecondsInMode - currentDurationRef.current) /
              totalSecondsInMode) *
            100;
          setProgressBarValue(progress);

          updateTimer(currentDurationRef.current);
        } else {
          clearInterval(ref.current);
          handleTimerEnd();
        }
      };

      intervalRef.current = setInterval(handleCountdown, 1000);
    };

    const pauseTimer = () => {
      clearInterval(intervalRef.current);
    };

    const resetTimer = () => {
      clearInterval(intervalRef.current);
      // Cập nhật thời gian
      switch (mode) {
        case POMODORO:
          setMinutes(pomodoroTime);
          break;
        case SHORT_BREAK:
          setMinutes(shortBreakTime);
          break;
        case LONG_BREAK:
          setMinutes(longBreakTime);
          break;
        default:
          break;
      }
      setSeconds(0);

      // Cập nhật giá trị progressBarValue
      setProgressBarValue(0);
    };
    ref.current = {
      start: startTimer,
      pause: pauseTimer,
      reset: resetTimer,
    };

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [ref, isRunning]);

  // Sử dụng useEffect để cập nhật giá trị minutes và seconds khi giá trị thay đổi
  useEffect(() => {
    switch (mode) {
      case POMODORO:
        setMinutes(pomodoroTime);
        break;
      case SHORT_BREAK:
        setMinutes(shortBreakTime);
        break;
      case LONG_BREAK:
        setMinutes(longBreakTime);
        break;
      default:
        break;
    }
    setSeconds(0);
  }, [pomodoroTime, shortBreakTime, longBreakTime, mode]);

  useEffect(() => {
    const totalSeconds = minutes * 60 + seconds;
    currentDurationRef.current = totalSeconds;
  }, [minutes, seconds]);

  return (
    <CircularProgressWithLabel
      minutes={minutes}
      seconds={seconds}
      variant="determinate"
      value={progressBarValue}
    />
  );
};

// Sử dụng React.forwardRef để chuyển tiếp ref từ Props
export default forwardRef(Timer);
