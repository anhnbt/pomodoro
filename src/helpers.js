import {
  POMODORO,
  TIME_FOR_A_BREAK,
  TIME_TO_FOCUS,
} from "./constants";


export function formatTime(minutes, seconds) {
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function updateTitle(minutes, seconds, mode) {
  const message = mode === POMODORO ? TIME_TO_FOCUS : TIME_FOR_A_BREAK;
  document.title = `${formatTime(minutes, seconds)} - ${message}`;
}