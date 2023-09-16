import React, { useState, useRef } from "react";
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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useSelector } from "react-redux";
import { useSnackbar } from '../SnackbarContext';

export default function Header() {
  const mode = useSelector((state) => state.mode);
  const [open, setOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(null);
  const settingsRef = useRef();
  const { openSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
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
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
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
            openSnackbar("Quyền thông báo đã được cấp.");
          } else {
            openSnackbar("Quyền thông báo bị từ chối.");
          }
        });
      }
    } else {
      // Trình duyệt không hỗ trợ API Notification
      openSnackbar("Trình duyệt của bạn không hỗ trợ thông báo.");
    }
  };

  const handleSaveSettings = () => {
    settingsRef.current.handleSaveSettings();
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: `${mode}.main`,
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
              <Settings ref={settingsRef} handleDialogClose={handleClose} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Đóng</Button>
              <Button variant="contained" onClick={handleSaveSettings}>
                Lưu cài đặt
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </div>
  );
}
