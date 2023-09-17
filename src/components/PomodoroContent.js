import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import Timer from "./Timer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import { setMode } from "../redux/settingsSlice";
import { POMODORO, SHORT_BREAK, LONG_BREAK } from "../constants/appConfig";
import { player } from "../utils/player";

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: "rgb(255, 255, 255)",
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-selected": {
      color: "#fff",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  })
);

const clickSound = player({
  asset: "audio/button-press.wav",
  volume: 0.5,
});

function PomodoroContent({
  pomodoroTime,
  shortBreakTime,
  longBreakTime,
  alarmAudio,
  tickingAudio,
  tickingSound,
  autoStartEnabled,
  autoStartPomodoroEnabled,
  mode,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const dispatch = useDispatch();

  // Sử dụng useRef để lưu trữ timerRef
  const timerRef = useRef(null);

  const toggleTimer = useCallback(() => {
    const playClickSound = () => {
      clickSound.play();
    };

    setIsRunning((prevIsRunning) => {
      if (!prevIsRunning && tickingSound !== "TICKING_NONE") {
        tickingAudio.play(); // Phát âm thanh tiếng đồng hồ khi bật
      } else {
        tickingAudio.stop(); // Dừng âm thanh khi tắt
      }
      playClickSound(); // Phát âm thanh trước khi thay đổi isRunning
      return !prevIsRunning; // Sử dụng prevState để đảm bảo tính toàn vẹn
    });
  }, [tickingAudio, tickingSound]);

  // Cập nhật hàm toggleTimer vào useEffect
  useEffect(() => {
    const handleSpacebarPress = (event) => {
      if (event.key === " ") {
        event.preventDefault(); // Ngăn trình duyệt scroll mặc định
        toggleTimer();
      }
    };

    document.addEventListener("keydown", handleSpacebarPress);

    return () => {
      document.removeEventListener("keydown", handleSpacebarPress);
    };
  }, [toggleTimer]);

  // Hàm bắt sự kiện khi bấm nút Reset
  const handleResetClick = () => {
    setIsRunning(false);
    tickingAudio.stop();
    timerRef.current.reset();
  };

  const switchMode = (event, newMode) => {
    // Ngừng timer nếu đang chạy
    setIsRunning(false);
    // Cập nhật chế độ và thời gian
    dispatch(setMode(newMode));
  };

  // Sử dụng useEffect để theo dõi giá trị isRunning và thực hiện các tương tác với Timer.js
  useEffect(() => {
    if (isRunning) {
      // Bắt đầu đếm ngược khi isRunning là true
      timerRef.current.start();
    } else {
      // Dừng đếm ngược khi isRunning là false
      timerRef.current.pause();
    }
  }, [isRunning]);

  return (
    <Box
      sx={{
        py: 2,
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: `${mode}.main`,
      }}
    >
      <StyledTabs
        textColor="secondary"
        indicatorColor="secondary"
        value={mode}
        onChange={switchMode}
        centered
      >
        <StyledTab value={POMODORO} label="Pomodoro" />
        <StyledTab value={SHORT_BREAK} label="Nghỉ ngắn" />
        <StyledTab value={LONG_BREAK} label="Nghỉ dài" />
      </StyledTabs>
      <Timer
        pomodoroTime={pomodoroTime}
        longBreakTime={longBreakTime}
        shortBreakTime={shortBreakTime}
        autoStartEnabled={autoStartEnabled}
        autoStartPomodoroEnabled={autoStartPomodoroEnabled}
        ref={timerRef}
        isRunning={isRunning}
        mode={mode}
        alarmAudio={alarmAudio}
        tickingAudio={tickingAudio}
        handleResetClick={handleResetClick}
      />
      <div className="controls">
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={toggleTimer}
            color="secondary"
          >
            {isRunning ? "Tạm dừng" : "Bắt đầu"}
          </Button>
          <Button onClick={handleResetClick} size="large" color="secondary">
            Đặt lại
          </Button>
        </Stack>
      </div>
    </Box>
  );
}

export default PomodoroContent;
