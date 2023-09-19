/* eslint-disable no-restricted-globals */
let countdownInterval;
let remainingTimeInSeconds = 0; // Thời gian còn lại tính bằng giây
let isRequestPending = false;
self.addEventListener("message", function (event) {
  if (event.data && event.data.time) {
    // Nhận tham số thời gian từ thông điệp
    const countdownTimeInSeconds = event.data.time;
    // Xử lý thời gian ở đây (ví dụ: bắt đầu đếm ngược)
    countdown(countdownTimeInSeconds);
  }
  if (event.data && event.data.type === "Pause") {
    // Xử lý sự kiện Pause (tạm dừng đếm ngược) ở đây
    pauseCountdown();
  } else if (event.data && event.data.type === "Reset") {
    // Xử lý sự kiện Reset (đặt lại đếm ngược) ở đây
    resetCountdown();
  }
});

function pauseCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function resetCountdown() {
  pauseCountdown();
}

function countdown(countdownTimeInSeconds) {
  remainingTimeInSeconds = countdownTimeInSeconds;
  countdownInterval = setInterval(function () {
    if (remainingTimeInSeconds > 0) {
      remainingTimeInSeconds--;
      // Gửi thông điệp về giao diện người dùng (React app) để cập nhật UI
      if (!isRequestPending) {
        isRequestPending = true;
        self.clients.matchAll().then((clients) => {
          if (clients && clients.length > 0) {
            clients[0].postMessage({
              type: "countdown",
              time: remainingTimeInSeconds,
            });
            isRequestPending = false;
          }
        });
      }
    } else {
      // Đếm ngược đã kết thúc, thực hiện các hành động sau khi kết thúc đếm ngược
      pauseCountdown();
      if (!isRequestPending) {
        isRequestPending = true;
        // Gửi thông điệp về giao diện người dùng (React app) để thông báo kết thúc đếm ngược
        self.clients.matchAll().then((clients) => {
          if (clients && clients.length > 0) {
            // Gửi tin nhắn đến tab hoặc bản gốc đầu tiên
            clients[0].postMessage({ type: "countdownFinished" });
            isRequestPending = false;
          }
        });
      }
    }
  }, 1000);
}
