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
  },
  ref
) => {
  const [minutes, setMinutes] = useState(pomodoroTime);
  const [seconds, setSeconds] = useState(0);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const [totalSecondsInMode, setTotalSecondsInMode] = useState(0);

  useEffect(() => {
    const handleTimerEnd = () => {
      console.log("autoStartEnabled", autoStartEnabled);
      console.log("autoStartPomodoroEnabled", autoStartPomodoroEnabled);
      switch (mode) {
        case POMODORO:
          sendNotification("Pomodoro kết thúc", "Hãy nghỉ ngắn 5 phút!");
          if (autoStartEnabled) {
            console.log("Pomodoro kết thúc autoStartEnabled", autoStartEnabled);
            setMode(SHORT_BREAK); // Chuyển sang chế độ Short Break
            startTimer(); // Bắt đầu đếm ngược cho Short Break
          }
          break;
        case SHORT_BREAK:
          sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
          if (autoStartPomodoroEnabled) {
            console.log(
              "SHORT_BREAK kết thúc autoStartEnabled",
              autoStartPomodoroEnabled
            );
            setMode(POMODORO); // Chuyển lại chế độ Pomodoro
            startTimer(); // Bắt đầu đếm ngược cho Pomodoro
          }
          break;
        case LONG_BREAK:
          sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
          if (autoStartPomodoroEnabled) {
            console.log(
              "LONG_BREAK kết thúc autoStartEnabled",
              autoStartEnabled
            );
            setMode(POMODORO); // Chuyển lại chế độ autoStartPomodoroEnabled
            startTimer(); // Bắt đầu đếm ngược cho Pomodoro
          }
          break;
        default:
          break;
      }
      alarmAudio.play();
      tickingAudio.stop();
      handleResetClick();
    };

    const startTimer = () => {
      const handleCountdown = () => {
        console.log("handleCountdown");
        let totalSeconds;
        switch (mode) {
          case POMODORO:
            totalSeconds = pomodoroTime * 60; // 25 phút cho Pomodoro
            break;
          case SHORT_BREAK:
            totalSeconds = shortBreakTime * 60; // 5 phút cho Short Break
            break;
          case LONG_BREAK:
            totalSeconds = longBreakTime * 60; // 15 phút cho Long Break
            break;
          default:
            break;
        }
        console.log("totalSeconds", totalSeconds);
        setTotalSecondsInMode(totalSeconds);
        navigator.serviceWorker.controller.postMessage({
          time: totalSeconds,
        }); // Chuyển thời gian thành giây
      };

      handleCountdown();
    };

    const pauseTimer = () => {
      // clearInterval(intervalRef.current);
      // Gửi thông điệp "Pause" đến service worker
      navigator.serviceWorker.controller.postMessage({ type: "Pause" });
    };

    const resetTimer = () => {
      // clearInterval(intervalRef.current);
      // Gửi thông điệp "Reset" đến service worker
      navigator.serviceWorker.controller.postMessage({ type: "Reset" });
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
  }, [
    ref,
    isRunning,
    mode,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    alarmAudio,
    autoStartEnabled,
    autoStartPomodoroEnabled,
    handleResetClick,
    tickingAudio,
  ]);

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
    if (!isMobileDevice()) {
      updateTitle(minutes, seconds, mode);
    }
  }, [minutes, seconds, mode]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "countdown") {
          const updateTimer = (duration) => {
            setMinutes(Math.floor(duration / 60));
            setSeconds(duration % 60);
          };
          // Nhận thông điệp countdown và xử lý nó ở đây
          const countdownTime = event.data.time;
          const progress =
            ((totalSecondsInMode - countdownTime) / totalSecondsInMode) * 100;
          setProgressBarValue(progress);

          updateTimer(countdownTime);
          console.log(`Countdown time remaining: ${countdownTime} seconds`);
        } else if (event.data.type === "countdownFinished") {
          // Nhận thông điệp countdownFinished và xử lý nó ở đây
          console.log("Countdown finished!");
        }
      });
    }
  }, []);

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
