import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { player } from "./player";
import {
  POMODORO_TIME,
  SHORT_BREAK_TIME,
  LONG_BREAK_TIME,
  ALARM_BELL,
  ALARM_BIRD,
  ALARM_DIGITAL,
  ALARM_KITCHEN,
  ALARM_WOOD,
  TICKING_FAST,
  TICKING_SLOW,
  WHITE_NOISE,
  BROWN_NOISE,
} from "./constants";

const alarmSound = player({
  asset: ALARM_DIGITAL,
  volume: 0.5,
});
const tickingSound = player({
  asset: TICKING_SLOW,
  volume: 0.5,
});

export default function Settings(props) {
  const { onClose, open } = props;
  const [volume, setVolume] = React.useState(50);
  const [pomodoroTime, setPomodoroTime] = React.useState(POMODORO_TIME);
  const [shortBreakTime, setShortBreakTime] = React.useState(SHORT_BREAK_TIME);
  const [longBreakTime, setLongBreakTime] = React.useState(LONG_BREAK_TIME);
  const [alarmSoundType, setAlarmSoundType] = React.useState("ALARM_DIGITAL");
  const [tickingSoundType, setTickingSoundType] =
    React.useState("TICKING_NONE");
  const [hourFormat, setHourFormat] = React.useState("HOUR_FORMAT_24");
  const [autoStartPomodoroEnabled, setAutoStartPomodoroEnabled] =
    React.useState(false);
  const [autoStartEnabled, setAutoStartEnabled] = React.useState(false);

  const handleChangeVolume = (event, newValue) => {
    setVolume(newValue);
    alarmSound.setVolume(newValue);
    tickingSound.setVolume(newValue);
  };

  const handleChangePomodoroTime = (event, newValue) => {
    setPomodoroTime(newValue);
  };

  const handleChangeShortBreakTime = (event, newValue) => {
    setShortBreakTime(newValue);
  };

  const handleChangeLongBreakTime = (event, newValue) => {
    setLongBreakTime(newValue);
  };

  const handleChangeHourFormat = (event) => {
    setHourFormat(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleChangeAlarmSoundType = (event) => {
    setAlarmSoundType(event.target.value);
    switch (event.target.value) {
      case "ALARM_BELL":
        alarmSound.setAudio(ALARM_BELL);
        break;
      case "ALARM_BIRD":
        alarmSound.setAudio(ALARM_BIRD);
        break;
      case "ALARM_DIGITAL":
        alarmSound.setAudio(ALARM_DIGITAL);
        break;
      case "ALARM_KITCHEN":
        alarmSound.setAudio(ALARM_KITCHEN);
        break;
      case "ALARM_WOOD":
        alarmSound.setAudio(ALARM_WOOD);
        break;
      default:
        break;
    }
    alarmSound.play();
  };

  const handleChangeTickingSoundType = (event) => {
    setTickingSoundType(event.target.value);
    switch (event.target.value) {
      case "TICKING_FAST":
        tickingSound.setAudio(TICKING_FAST);
        break;
      case "TICKING_SLOW":
        tickingSound.setAudio(TICKING_SLOW);
        break;
      case "WHITE_NOISE":
        tickingSound.setAudio(WHITE_NOISE);
        break;
      case "BROWN_NOISE":
        tickingSound.setAudio(BROWN_NOISE);
        break;
      case "TICKING_NONE":
      default:
        break;
    }
    if (event.target.value !== "TICKING_NONE") {
      tickingSound.play();
    } else {
      tickingSound.stop();
    }
  };

  const handleChangeAutoStartEnabled = (event) => {
    setAutoStartEnabled(event.target.checked);
  };

  const handleChangeAutoStartPomodoroEnabled = (event) => {
    setAutoStartPomodoroEnabled(event.target.checked);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Cài đặt</DialogTitle>
      <DialogContent>
        <FormGroup>
          <Box
            sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}
          >
            <Box sx={{ my: 1, mx: 1 }}>
              <Typography variant="h6" gutterBottom>
                Âm thanh
              </Typography>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                rowSpacing={2}
                columnSpacing={0}
              >
                <Grid item xs={8}>
                  Báo động
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="alarm-sound-type=label">
                      Báo động
                    </InputLabel>
                    <Select
                      labelId="alarm-sound-type-label"
                      id="alarm-sound-type"
                      value={alarmSoundType}
                      label="Âm thanh tích tắc"
                      onChange={handleChangeAlarmSoundType}
                    >
                      <MenuItem value={"ALARM_BELL"}>Bell</MenuItem>
                      <MenuItem value={"ALARM_BIRD"}>Bird</MenuItem>
                      <MenuItem value={"ALARM_DIGITAL"}>Digital</MenuItem>
                      <MenuItem value={"ALARM_KITCHEN"}>Kitchen</MenuItem>
                      <MenuItem value={"ALARM_WOOD"}>Wood</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8}>
                  Tích tắc
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="ticking-sound-type=label">
                      Tích tắc
                    </InputLabel>
                    <Select
                      labelId="ticking-sound-type-label"
                      id="ticking-sound-type"
                      value={tickingSoundType}
                      label="Âm thanh tích tắc"
                      onChange={handleChangeTickingSoundType}
                    >
                      <MenuItem value="TICKING_NONE">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"TICKING_FAST"}>Ticking Fast</MenuItem>
                      <MenuItem value={"TICKING_SLOW"}>Ticking Slow</MenuItem>
                      <MenuItem value={"WHITE_NOISE"}>White Noise</MenuItem>
                      <MenuItem value={"BROWN_NOISE"}>Brown Noise</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Stack
                spacing={2}
                direction="row"
                sx={{ pt: 4 }}
                alignItems="center"
              >
                <VolumeDown />
                <Slider
                  defaultValue={50}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  value={volume}
                  onChange={handleChangeVolume}
                />
                <VolumeUp />
              </Stack>
            </Box>
            <Divider variant="middle" />

            <Box sx={{ my: 3, mx: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thời gian (phút)
              </Typography>
              <Typography id="pomodoro-slider" gutterBottom variant="body1">
                Pomodoro
              </Typography>
              <Slider
                defaultValue={25}
                value={pomodoroTime}
                min={5}
                step={5}
                max={120}
                onChange={handleChangePomodoroTime}
                valueLabelDisplay="auto"
                aria-labelledby="pomodoro-slider"
              />
              <Typography id="short-break-slider" gutterBottom variant="body1">
                Nghỉ ngắn
              </Typography>
              <Slider
                defaultValue={5}
                value={shortBreakTime}
                min={5}
                step={5}
                max={30}
                onChange={handleChangeShortBreakTime}
                valueLabelDisplay="auto"
                aria-labelledby="short-break-slider"
              />
              <Typography id="long-break-slider" gutterBottom variant="body1">
                Nghỉ dài
              </Typography>
              <Slider
                defaultValue={15}
                value={longBreakTime}
                min={5}
                step={5}
                max={30}
                onChange={handleChangeLongBreakTime}
                valueLabelDisplay="auto"
                aria-labelledby="long-break-slider"
              />
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={10}>
                  Tự động chạy Pomodoro
                </Grid>
                <Grid item xs={2}>
                  <Switch
                    checked={autoStartPomodoroEnabled}
                    onChange={handleChangeAutoStartPomodoroEnabled}
                    inputProps={{ "aria-label": "autoStartPomodoroEnabled" }}
                  />
                </Grid>
                <Grid item xs={10}>
                  Tự động chạy giờ giải lao
                </Grid>
                <Grid item xs={2}>
                  <Switch
                    checked={autoStartEnabled}
                    onChange={handleChangeAutoStartEnabled}
                    inputProps={{ "aria-label": "autoStartEnabled" }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Divider variant="middle" />

            <Box sx={{ my: 3, mx: 2 }}>
              <Typography variant="h6" gutterBottom>
                Đồng hồ
              </Typography>

              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={8}>
                  Định dạng giờ
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="hour-format-label"
                      id="hour-format"
                      value={hourFormat}
                      onChange={handleChangeHourFormat}
                    >
                      <MenuItem value={"HOUR_FORMAT_12"}>12 tiếng</MenuItem>
                      <MenuItem value={"HOUR_FORMAT_24"}>24 tiếng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
        <Button variant="contained" onClick={handleClose}>Lưu lại</Button>
      </DialogActions>
    </Dialog>
  );
}

Settings.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
