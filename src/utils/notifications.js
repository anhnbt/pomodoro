export function sendNotification(title, body) {
  if (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  ) {
    // Kiểm tra xem quyền thông báo đã được cấp cho ứng dụng hay chưa
    if (Notification.permission === "granted") {
      // Đã cấp quyền, bạn có thể hiển thị thông báo
      new Notification(title, {
        body: body,
        icon: "images/logo512.png",
        dir: "ltr",
      });
    } else if (Notification.permission === "denied") {
      // Quyền bị từ chối, hiển thị thông báo yêu cầu người dùng cấp quyền
      console.log("Vui lòng cho phép thông báo để sử dụng tính năng này.");
    } else {
      // Quyền chưa được cấp, hiển thị thông báo yêu cầu cấp quyền
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          // Quyền đã được cấp, bạn có thể hiển thị thông báo
          new Notification(title, {
            body: body,
            icon: "images/logo512.png",
            dir: "ltr",
          });
        } else {
          // Quyền bị từ chối, xử lý tùy ý (ví dụ: hiển thị thông báo khác)
          console.log("Vui lòng cho phép thông báo để sử dụng tính năng này.");
        }
      });
    }
  } else {
    // Trình duyệt không hỗ trợ API Notification
    console.log("Trình duyệt của bạn không hỗ trợ thông báo.");
  }
}
