document.addEventListener("DOMContentLoaded", () => {
  console.log("Pomodoro Vietnam!");

  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  let timer;
  let minutes = 1; // Khai báo giá trị ban đầu cho minutes
  let seconds = 0; // Khai báo giá trị ban đầu cho seconds
  let isTimerRunning = false; // Thêm biến để theo dõi trạng thái của timer

  function updateTimerDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  function toggleTimer() {
    if (isTimerRunning) {
      clearInterval(timer);
      startButton.textContent = "Start"; // Đổi nút sang 'Start'
    } else {
      // chrome.runtime.sendMessage({ action: "startTimer" }); // Bắt đầu thời gian từ nền
      if (minutes === 0 && seconds === 0) {
        minutes = 25;
        seconds = 0;
      }
      startButton.textContent = "Pause"; // Đổi nút sang 'Pause'
    }
    isTimerRunning = !isTimerRunning; // Đảo ngược trạng thái
  }

  function resetTimer() {
    clearInterval(timer);
    minutes = 1;
    seconds = 0;
    isTimerRunning = false; // Đặt lại trạng thái timer
    startButton.textContent = "Start"; // Đổi nút về 'Start' khi đặt lại
    updateTimerDisplay(); // Cập nhật giá trị trên giao diện
    chrome.runtime.sendMessage({ action: "resetTimer" });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "timerCompleted") {
      clearInterval(timer);
      updateTimerDisplay();
      isTimerRunning = false; // Đặt lại trạng thái timer
      startButton.textContent = "Start"; // Đổi nút về 'Start' khi hoàn thành
      console.log("Pomodoro session completed!");
    } else if (request.action === "updateDisplay") {
      minutes = request.minutes; // Cập nhật giá trị minutes từ background.js
      seconds = request.seconds; // Cập nhật giá trị seconds từ background.js
      updateTimerDisplay(); // Cập nhật giá trị trên giao diện từ background.js
    }
  });

  startButton.addEventListener("click", toggleTimer);
  resetButton.addEventListener("click", resetTimer);

  updateTimerDisplay();
});