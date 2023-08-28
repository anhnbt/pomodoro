document.addEventListener("DOMContentLoaded", () => {
  console.log("Pomodoro Vietnam!");
  const DEFAULT_POMODORO_MINUTES = 25;
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");
  let minutes = DEFAULT_POMODORO_MINUTES; // Khai báo giá trị ban đầu cho minutes
  let seconds = 0; // Khai báo giá trị ban đầu cho seconds
  let isTimerRunning = false; // Thêm biến để theo dõi trạng thái của timer

  function updateTimerDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  function toggleTimer() {
    if (isTimerRunning) {
      console.log("Tạm dừng");
      chrome.runtime.sendMessage({ action: "pauseTimer" }); // Gửi thông điệp để tạm dừng thời gian
      isTimerRunning = false; // Đặt trạng thái timer về tạm dừng
      startButton.textContent = "Bắt đầu"; // Đổi nút sang 'Start'
    } else {
      console.log("Bắt đầu");
      if (minutes === 0 && seconds === 0) {
        minutes = DEFAULT_POMODORO_MINUTES;
        seconds = 0;
      }
      chrome.runtime.sendMessage({ action: "startTimer" }); // Bắt đầu thời gian từ nền
      isTimerRunning = true; // Đặt trạng thái timer về đang chạy
      startButton.textContent = "Tạm dừng"; // Đổi nút sang 'Pause'
    }
  }

  function resetTimer() {
    minutes = DEFAULT_POMODORO_MINUTES;
    seconds = 0;
    isTimerRunning = false; // Đặt lại trạng thái timer
    startButton.textContent = "Bắt đầu"; // Đổi nút về 'Start' khi đặt lại
    updateTimerDisplay(); // Cập nhật giá trị trên giao diện
    chrome.runtime.sendMessage({ action: "resetTimer" }); // Gửi thông điệp để reset thời gian
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "timerCompleted") {
      isTimerRunning = false; // Đặt lại trạng thái timer
      startButton.textContent = "Bắt đầu"; // Đổi nút về 'Start' khi hoàn thành
      console.log("Pomodoro session completed!");
      // Đặt lại thời gian về mặc định
      minutes = DEFAULT_POMODORO_MINUTES;
      seconds = 0;

      // Cập nhật hiển thị thời gian
      updateTimerDisplay();

      // Gửi thông điệp để dừng bộ đếm thời gian từ popup đến background script
      chrome.runtime.sendMessage({ action: "stopTimer" });
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
