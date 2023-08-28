window.addEventListener("DOMContentLoaded", (event) => {
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const minutesDisplay = document.getElementById("minutes");
  const secondsDisplay = document.getElementById("seconds");

  let minutes = 25;
  let seconds = 0;
  let timer;

  function updateTimerDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
  }

  function startTimer() {
    timer = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else {
        if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          clearInterval(timer);
          alert("Phiên Pomodoro đã hoàn thành!");
        }
      }
      updateTimerDisplay();
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timer);
    minutes = 25;
    seconds = 0;
    updateTimerDisplay();
  }

  startButton.addEventListener("click", startTimer);
  resetButton.addEventListener("click", resetTimer);
});
