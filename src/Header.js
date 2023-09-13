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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(null);
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
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    ) {
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
    } else {
      // Trình duyệt không hỗ trợ API Notification
      setState({
        vertical: "bottom",
        horizontal: "center",
        openSnackbar: true,
        msg: "Trình duyệt của bạn không hỗ trợ thông báo.",
      });
    }
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: `pomodoro.main`,
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
            sx={{ display: { xs: "none", sm: "inherit" } }}
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
          <IconButton
            color="inherit"
            aria-label="Settings"
            onClick={handleClickOpen}
          >
            <SettingsIcon />
          </IconButton>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Cài đặt</DialogTitle>
            <DialogContent>
              <Settings />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Đóng</Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
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
