import React, { useEffect } from "react";
import {
  ALARM_BELL,
  ALARM_BIRD,
  ALARM_DIGITAL,
  ALARM_KITCHEN,
  ALARM_WOOD,
  TICKING_NONE,
  TICKING_FAST,
  TICKING_SLOW,
  WHITE_NOISE,
  BROWN_NOISE,
} from "../constants/appConfig";
import { useSelector } from "react-redux";
import PomodoroInfo from "./PomodoroInfo";
import PomodoroContent from "./PomodoroContent";
import { player } from "../utils/player";

const alarmAudio = player({
  asset: ALARM_DIGITAL,
  volume: 0.5,
});

const tickingAudio = player({
  asset: TICKING_NONE,
  volume: 0.5,
  loop: true,
});

function Pomodoro() {
  // Lấy các giá trị từ Redux store bằng useSelector
  const pomodoroTime = useSelector((state) => state.settings.pomodoroTime);
  const shortBreakTime = useSelector((state) => state.settings.shortBreakTime);
  const longBreakTime = useSelector((state) => state.settings.longBreakTime);
  const volume = useSelector((state) => state.settings.volume);
  const alarmSound = useSelector((state) => state.settings.alarmSound);
  const tickingSound = useSelector((state) => state.settings.tickingSound);
  const autoStartPomodoroEnabled = useSelector(
    (state) => state.settings.autoStartPomodoroEnabled
  );
  const autoStartEnabled = useSelector(
    (state) => state.settings.autoStartEnabled
  );
  const mode = useSelector((state) => state.settings.mode);
  useEffect(() => {
    switch (alarmSound) {
      case "ALARM_BELL":
        alarmAudio.setAudio(ALARM_BELL);
        break;
      case "ALARM_BIRD":
        alarmAudio.setAudio(ALARM_BIRD);
        break;
      case "ALARM_DIGITAL":
        alarmAudio.setAudio(ALARM_DIGITAL);
        break;
      case "ALARM_KITCHEN":
        alarmAudio.setAudio(ALARM_KITCHEN);
        break;
      case "ALARM_WOOD":
        alarmAudio.setAudio(ALARM_WOOD);
        break;
      default:
        break;
    }
    alarmAudio.setVolume(volume);
  }, [alarmSound, volume]);

  useEffect(() => {
    switch (tickingSound) {
      case "TICKING_FAST":
        tickingAudio.setAudio(TICKING_FAST);
        break;
      case "TICKING_SLOW":
        tickingAudio.setAudio(TICKING_SLOW);
        break;
      case "WHITE_NOISE":
        tickingAudio.setAudio(WHITE_NOISE);
        break;
      case "BROWN_NOISE":
        tickingAudio.setAudio(BROWN_NOISE);
        break;
      case "TICKING_NONE":
      default:
        tickingAudio.setAudio(TICKING_NONE);
        break;
    }
    tickingAudio.setVolume(volume);
  }, [tickingSound, volume]);

  return (
    <div className="pomodoro-app">
      <PomodoroContent
        pomodoroTime={pomodoroTime}
        shortBreakTime={shortBreakTime}
        longBreakTime={longBreakTime}
        alarmAudio={alarmAudio}
        tickingSound={tickingSound}
        tickingAudio={tickingAudio}
        autoStartPomodoroEnabled={autoStartPomodoroEnabled}
        autoStartEnabled={autoStartEnabled}
        mode={mode}
      />
      <PomodoroInfo />
    </div>
  );
}

export default Pomodoro;
