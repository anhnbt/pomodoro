import React, { useState, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Settings from './Settings';
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from '../SnackbarContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { setDarkMode } from '../redux/settingsSlice';

export default function Header() {
  const mode = useSelector((state) => state.settings.mode);
  const [open, setOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(null);
  const settingsRef = useRef();
  const { openSnackbar } = useSnackbar();
  const isDarkMode = useSelector((state) => state.settings.isDarkMode);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

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
    setIsFullscreen(!isFullscreen);
  };

  const requestNotificationPermission = () => {
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    ) {
      if (
        Notification.permission !== 'granted' &&
        Notification.permission !== 'denied'
      ) {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
          if (permission === 'granted') {
            openSnackbar('Quyền thông báo đã được cấp.');
          } else {
            openSnackbar('Quyền thông báo bị từ chối.');
          }
        });
      }
    } else {
      openSnackbar('Trình duyệt của bạn không hỗ trợ thông báo.');
    }
  };

  const handleSaveSettings = () => {
    settingsRef.current.handleSaveSettings();
  };

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!isDarkMode));
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: `${mode}.main`,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            🍅 Pomodoro Vietnam
          </Typography>
          {notificationPermission === 'granted' ? (
            <Tooltip title="Quyền thông báo đã được bật">
              <IconButton color="inherit" aria-label="NotificationsActive">
                <NotificationsActiveIcon />
              </IconButton>
            </Tooltip>
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
            title={
              isFullscreen
                ? 'Thoát chế độ toàn màn hình'
                : 'Chế độ toàn màn hình'
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
          <Tooltip title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
            <IconButton
              color="inherit"
              aria-label="DarkModeToggle"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
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
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                sx={{ backgroundColor: '#1976d2', color: '#fff' }}
              >
                Lưu cài đặt
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </div>
  );
}
