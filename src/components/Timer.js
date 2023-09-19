import React, { useState, useEffect, forwardRef, useRef } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import { setMode } from "../redux/settingsSlice";
import { POMODORO, SHORT_BREAK, LONG_BREAK } from "../constants/appConfig";
import { sendNotification } from "../utils/notifications";
import { updateTitle, isMobileDevice } from "../utils/helperFunctions";

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
    tickingSound
  },
  ref
) => {
  const [minutes, setMinutes] = useState(pomodoroTime);
  const [seconds, setSeconds] = useState(0);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [totalSecondsInMode, setTotalSecondsInMode] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);

  useEffect(() => {
    const startTimer = () => {
      navigator.serviceWorker.controller.postMessage({
        time: currentDuration > 0 ? currentDuration : totalSecondsInMode,
      });
      if (tickingSound !== "TICKING_NONE") {
        tickingAudio.play(); // Phát âm thanh tiếng đồng hồ khi bật
      }
    };

    const pauseTimer = () => {
      // Gửi thông điệp "Pause" đến service worker
      navigator.serviceWorker.controller.postMessage({ type: "Pause" });
    };

    const resetTimer = () => {
      // Gửi thông điệp "Reset" đến service worker
      navigator.serviceWorker.controller.postMessage({ type: "Reset" });
      // Cập nhật thời gian
      switch (mode) {
        case POMODORO:
          setMinutes(pomodoroTime);
          setTotalSecondsInMode(pomodoroTime * 60);
          break;
        case SHORT_BREAK:
          setMinutes(shortBreakTime);
          setTotalSecondsInMode(shortBreakTime * 60);
          break;
        case LONG_BREAK:
          setMinutes(longBreakTime);
          setTotalSecondsInMode(longBreakTime * 60);
          break;
        default:
          break;
      }
      setSeconds(0);
      // Cập nhật giá trị progressBarValue
      setProgressBarValue(0);
      setCurrentDuration(0);
    };
    ref.current = {
      start: startTimer,
      pause: pauseTimer,
      reset: resetTimer,
    };
  }, [
    ref,
    isRunning,
    mode,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    currentDuration,
    totalSecondsInMode,
  ]);

  // Sử dụng useEffect để cập nhật giá trị minutes và seconds khi giá trị thay đổi
  useEffect(() => {
    switch (mode) {
      case POMODORO:
        setMinutes(pomodoroTime);
        setTotalSecondsInMode(pomodoroTime * 60);
        break;
      case SHORT_BREAK:
        setMinutes(shortBreakTime);
        setTotalSecondsInMode(shortBreakTime * 60);
        break;
      case LONG_BREAK:
        setMinutes(longBreakTime);
        setTotalSecondsInMode(longBreakTime * 60);
        break;
      default:
        break;
    }
    setSeconds(0);
    setCurrentDuration(0);
    setProgressBarValue(0);
  }, [pomodoroTime, shortBreakTime, longBreakTime, mode]);

  useEffect(() => {
    if (!isMobileDevice()) {
      updateTitle(minutes, seconds, mode);
    }
  }, [minutes, seconds, mode]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "countdown") {
          const updateTimer = (duration) => {
            setCurrentDuration(duration);
            setMinutes(Math.floor(duration / 60));
            setSeconds(duration % 60);
          };
          // Nhận thông điệp countdown và xử lý nó ở đây
          const countdownTime = event.data.time;
          const progress =
            ((totalSecondsInMode - countdownTime) / totalSecondsInMode) * 100;
          setProgressBarValue(progress);

          updateTimer(countdownTime);
        } else if (event.data.type === "countdownFinished") {
          // Nhận thông điệp countdownFinished và xử lý nó ở đây
          switch (mode) {
            case POMODORO:
              sendNotification("Pomodoro kết thúc", "Hãy nghỉ ngắn 5 phút!");
              break;
            case SHORT_BREAK:
              sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
              break;
            case LONG_BREAK:
              sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
              break;
            default:
              break;
          }
          alarmAudio.play();
          handleResetClick();
        }
      });
    }
  }, [alarmAudio, totalSecondsInMode, handleResetClick, mode]);

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
