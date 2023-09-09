/*global chrome*/
const DEFAULT_POMODORO_MINUTES = 25;
let timer;
let minutes;
let seconds;
let isRunning = false;
chrome.storage.local.get(
  ["pomodoroMinutes", "pomodoroSeconds", "isRunning"],
  (result) => {
    minutes = result.pomodoroMinutes || DEFAULT_POMODORO_MINUTES;
    seconds = result.pomodoroSeconds || 0;
    isRunning = result.isRunning || false;
    updateTimerDisplay(); // Cập nhật giá trị trên giao diện khi tải xong
    //startBackgroundTimer();
  }
);

function updateTimerDisplay() {
  chrome.runtime.sendMessage({
    action: "updateDisplay",
    minutes,
    seconds,
    isRunning,
  });
}
function startBackgroundTimer() {
  console.log("start time");
  timer = setInterval(() => {
    if (seconds > 0) {
      seconds--;
    } else {
      if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else {
        clearInterval(timer);
        chrome.runtime.sendMessage({
          action: "timerCompleted",
        });
        playSound();
      }
    }
    saveTimerToStorage();
    updateTimerDisplay(); // Cập nhật giá trị trên giao diện sau mỗi tick
  }, 1000);
}
function saveTimerToStorage() {
    // Lưu trạng thái isRunning, minutes, seconds vào chrome.storage
  chrome.storage.local.set({
    pomodoroMinutes: minutes,
    pomodoroSeconds: seconds,
    isRunning: isRunning,
  });
}
function resetBackgroundTimer() {
  clearInterval(timer);
  minutes = DEFAULT_POMODORO_MINUTES;
  seconds = 0;
  isRunning = false;
  saveTimerToStorage();
  updateTimerDisplay(); // Cập nhật hiển thị sau khi đặt lại thời gian
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startTimer") {
    isRunning = true;
    startBackgroundTimer();
  } else if (request.action === "stopTimer") {
    clearInterval(timer);
    isRunning = false;
    // Thực hiện các xử lý khác cần thiết
  } else if (request.action === "resetTimer") {
    resetBackgroundTimer();
  } else if (request.action === "pauseTimer") {
    clearInterval(timer);
    isRunning = false;
    // Thực hiện các xử lý khác cần thiết
  }
});

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound(source = "audio/casio-watch.mp3", volume = 1) {
  await createOffscreen();
  await chrome.runtime.sendMessage({
    play: {
      source,
      volume,
    },
  });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "testing", // details for using the API
  });
}
