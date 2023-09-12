import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Settings from "./Settings";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";

export default function Header(props) {
  const [open, setOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    msg: "",
  });
  const { vertical, horizontal, openSnackbar, msg } = state;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setState({ ...state, openSnackbar: false });
  };

  // Hàm để toggle fullscreen
  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      }
      // ... (Các phương thức khác để yêu cầu fullscreen)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      // ... (Các phương thức khác để thoát fullscreen)
    }
    setIsFullscreen(!isFullscreen); // Cập nhật trạng thái fullscreen
  };

  // Hàm để yêu cầu trình duyệt bật thông báo
  const requestNotificationPermission = () => {
    // Kiểm tra xem trình duyệt hỗ trợ API Notification
    if ("Notification" in window) {
      // Xin quyền thông báo khi component được tạo lần đầu
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
          if (permission === "granted") {
            setState({
              vertical: "bottom",
              horizontal: "center",
              openSnackbar: true,
              msg: "Quyền thông báo đã được cấp.",
            });
          } else {
            setState({
              vertical: "bottom",
              horizontal: "center",
              openSnackbar: true,
              msg: "Quyền thông báo bị từ chối.",
            });
          }
        });
      }
    }
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: `${props.mode}.main`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Pomodoro Vietnam
          </Typography>
          {notificationPermission === "granted" ? (
            <IconButton color="inherit" aria-label="NotificationsActive">
              <Tooltip title="Quyền thông báo đã được bật">
                <NotificationsActiveIcon />
              </Tooltip>
            </IconButton>
          ) : (
            <Tooltip title="Bật thông báo">
              <IconButton
                color="inherit"
                aria-label="NotificationsIcon"
                onClick={requestNotificationPermission}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            sx={{ display: { xs: "none", sm: "block" } }}
            title={
              isFullscreen
                ? "Thoát chế độ toàn màn hình"
                : "Chế độ toàn màn hình"
            }
          >
            <IconButton
              color="inherit"
              aria-label="Fullscreen"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Cài đặt">
            <IconButton
              color="inherit"
              aria-label="Settings"
              onClick={handleClickOpen}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Settings open={open} onClose={handleClose} />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={msg}
        key={vertical + horizontal}
      />
    </div>
  );
}
