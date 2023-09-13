import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
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
  DEFAULT_POMODORO_TIME,
  SHORT_BREAK_TIME,
  LONG_BREAK_TIME,
  ALARM_BELL,
  ALARM_BIRD,
  ALARM_DIGITAL,
  ALARM_KITCHEN,
  ALARM_WOOD,
  TICKING_NONE,
  TICKING_FAST,
  TICKING_SLOW,
  WHITE_NOISE,
  BROWN_NOISE,
} from "./constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setPomodoroTime,
  setVolume,
  setShortBreakTime,
  setLongBreakTime,
  setAlarmSoundType,
  setTickingSoundType,
  setHourFormat,
  setAutoStartPomodoroEnabled,
  setAutoStartEnabled,
} from "./redux/settingsSlice";

const alarmSound = player({
  asset: ALARM_DIGITAL,
  volume: 0.5,
});
const tickingSound = player({
  asset: TICKING_SLOW,
  volume: 0.5,
});

export default function Settings() {
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  // Khai báo các biến state để lưu các giá trị cài đặt mới
  const [newVolume, setNewVolume] = useState(settings.volume);
  const [newPomodoroTime, setNewPomodoroTime] = useState(settings.pomodoroTime);
  const [newShortBreakTime, setNewShortBreakTime] = useState(
    settings.shortBreakTime
  );
  const [newLongBreakTime, setNewLongBreakTime] = useState(
    settings.longBreakTime
  );
  const [newAlarmSoundType, setNewAlarmSoundType] = useState(
    settings.alarmSoundType
  );
  const [newTickingSoundType, setNewTickingSoundType] = useState(
    settings.tickingSoundType
  );
  const [newHourFormat, setNewHourFormat] = useState(settings.hourFormat);
  const [newAutoStartPomodoroEnabled, setNewAutoStartPomodoroEnabled] =
    useState(settings.autoStartPomodoroEnabled);
  const [newAutoStartEnabled, setNewAutoStartEnabled] = useState(
    settings.autoStartEnabled
  );

  const handleSaveSettings = () => {
    // Thực hiện lưu các giá trị cài đặt vào Redux store và Local Storage
    dispatch(setPomodoroTime(newPomodoroTime));
    dispatch(setVolume(newVolume));
    dispatch(setShortBreakTime(newShortBreakTime));
    dispatch(setLongBreakTime(newLongBreakTime));
    dispatch(setAlarmSoundType(newAlarmSoundType));
    dispatch(setTickingSoundType(newTickingSoundType));
    dispatch(setHourFormat(newHourFormat));
    dispatch(setAutoStartPomodoroEnabled(newAutoStartPomodoroEnabled));
    dispatch(setAutoStartEnabled(newAutoStartEnabled));

    // Lưu vào Local Storage (bạn cần xử lý lưu vào Local Storage ở đây)
    localStorage.setItem("pomodoroTime", newPomodoroTime);
    localStorage.setItem("volume", newVolume);
    localStorage.setItem("shortBreakTime", newShortBreakTime);
    localStorage.setItem("longBreakTime", newLongBreakTime);
    localStorage.setItem("alarmSoundType", newAlarmSoundType);
    localStorage.setItem("tickingSoundType", newTickingSoundType);
    localStorage.setItem("hourFormat", newHourFormat);
    localStorage.setItem(
      "autoStartPomodoroEnabled",
      newAutoStartPomodoroEnabled
    );
    localStorage.setItem("autoStartEnabled", newAutoStartEnabled);
  };

  const handleChangeAlarmSoundType = (event) => {
    setNewAlarmSoundType(event.target.value);
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
    setNewTickingSoundType(event.target.value);
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

  return (
    <FormGroup>
      <Box sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}>
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
                <InputLabel id="alarm-sound-type=label">Báo động</InputLabel>
                <Select
                  labelId="alarm-sound-type-label"
                  id="alarm-sound-type"
                  value={newAlarmSoundType}
                  label="Âm thanh tích tắc"
                  onChange={handleChangeAlarmSoundType}
                >
                  <MenuItem value={'ALARM_BELL'}>Bell</MenuItem>
                  <MenuItem value={'ALARM_BIRD'}>Bird</MenuItem>
                  <MenuItem value={'ALARM_DIGITAL'}>Digital</MenuItem>
                  <MenuItem value={'ALARM_KITCHEN'}>Kitchen</MenuItem>
                  <MenuItem value={'ALARM_WOOD'}>Wood</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              Tích tắc
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="ticking-sound-type=label">Tích tắc</InputLabel>
                <Select
                  labelId="ticking-sound-type-label"
                  id="ticking-sound-type"
                  value={newTickingSoundType}
                  label="Âm thanh tích tắc"
                  onChange={handleChangeTickingSoundType}
                >
                  <MenuItem value={'TICKING_NONE'}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'TICKING_FAST'}>Ticking Fast</MenuItem>
                  <MenuItem value={'TICKING_SLOW'}>Ticking Slow</MenuItem>
                  <MenuItem value={'WHITE_NOISE'}>White Noise</MenuItem>
                  <MenuItem value={'BROWN_NOISE'}>Brown Noise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Stack spacing={2} direction="row" sx={{ pt: 4 }} alignItems="center">
            <VolumeDown />
            <Slider
              aria-label="Default"
              valueLabelDisplay="auto"
              value={newVolume}
              onChange={(e, value) => setNewVolume(value)}
              min={0}
              max={1}
              step={0.01}
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
            value={newPomodoroTime}
            min={5}
            step={5}
            max={120}
            onChange={(e) => setNewPomodoroTime(e.target.value)}
            valueLabelDisplay="auto"
            aria-labelledby="pomodoro-slider"
          />
          <Typography id="short-break-slider" gutterBottom variant="body1">
            Nghỉ ngắn
          </Typography>
          <Slider
            defaultValue={5}
            value={newShortBreakTime}
            min={5}
            step={5}
            max={30}
            onChange={(e) => setNewShortBreakTime(e.target.value)}
            valueLabelDisplay="auto"
            aria-labelledby="short-break-slider"
          />
          <Typography id="long-break-slider" gutterBottom variant="body1">
            Nghỉ dài
          </Typography>
          <Slider
            defaultValue={15}
            value={newLongBreakTime}
            min={5}
            step={5}
            max={30}
            onChange={(e) => setNewLongBreakTime(e.target.value)}
            valueLabelDisplay="auto"
            aria-labelledby="long-break-slider"
          />
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={10}>
              Tự động chạy Pomodoro
            </Grid>
            <Grid item xs={2}>
              <Switch
                checked={newAutoStartPomodoroEnabled}
                onChange={() =>
                  setNewAutoStartPomodoroEnabled(!newAutoStartPomodoroEnabled)
                }
                inputProps={{ "aria-label": "newAutoStartPomodoroEnabled" }}
              />
            </Grid>
            <Grid item xs={10}>
              Tự động chạy giờ giải lao
            </Grid>
            <Grid item xs={2}>
              <Switch
                checked={newAutoStartEnabled}
                onChange={() =>
                  setNewAutoStartEnabled(!newAutoStartPomodoroEnabled)
                }
                inputProps={{ "aria-label": "newAutoStartEnabled" }}
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
                  value={newHourFormat}
                  onChange={(e) => setNewHourFormat(e.target.value)}
                >
                  <MenuItem value={"12"}>12 Giờ</MenuItem>
                  <MenuItem value={"24"}>24 Giờ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Button variant="contained" onClick={handleSaveSettings}>
          Lưu lại
        </Button>
      </Box>
    </FormGroup>
  );
}
