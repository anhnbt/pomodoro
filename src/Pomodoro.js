import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import Header from "./Header";
import {
  POMODORO,
  SHORT_BREAK,
  LONG_BREAK,
  TIME_FOR_A_BREAK,
  TIME_TO_FOCUS,
  POMODORO_TIME,
  SHORT_BREAK_TIME,
  LONG_BREAK_TIME,
  START,
  PAUSE,
  RESET,
  DIGITAL_SOUND
} from "./constants";
import { updateTitle } from "./helpers";
import { player } from "./player";

const buttonSound = player({
  asset: "audio/button-press.wav",
  volume: 0.5,
});

const alarmAudio = player({
  asset: DIGITAL_SOUND,
  volume: 0.5,
});

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

function Pomodoro() {
  const [minutes, setMinutes] = useState(POMODORO_TIME); // Khai báo giá trị ban đầu cho minutes
  const [seconds, setSeconds] = useState(0); // Khai báo giá trị ban đầu cho seconds
  const [isRunning, setIsRunning] = useState(false); // Thêm biến để theo dõi trạng thái của timer
  const [mode, setMode] = useState(POMODORO); // Mặc định là Pomodoro
  const [progressBarValue, setProgressBarValue] = useState(0);

  useEffect(() => {
    // Xin quyền thông báo khi component được tạo lần đầu
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Quyền thông báo đã được cấp.");
        } else {
          console.log("Quyền thông báo bị từ chối.");
        }
      });
    }
  }, []); // [] đảm bảo rằng useEffect chỉ chạy một lần khi component được tạo ra lần đầu

  useEffect(() => {
    let timerInterval;
    let totalSeconds;
    let totalSecondsInMode;
    let notification;

    if (isRunning) {
      timerInterval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          clearInterval(timerInterval);
          setIsRunning(false); // Đặt trạng thái timer về tạm dừng
          setProgressBarValue(0); // Cập nhật giá trị progressBarValue

          switch (mode) {
            case POMODORO:
              setMinutes(POMODORO_TIME);
              setSeconds(0);

              // Gửi thông báo
              notification = new Notification("Pomodoro đã hoàn thành", {
                body: "Đã đến lúc phải nghỉ ngơi!",
                icon: "images/logo512.png",
                dir: "ltr",
              });
              break;
            case SHORT_BREAK:
              setMinutes(SHORT_BREAK_TIME);
              setSeconds(0);

              // Gửi thông báo
              notification = new Notification("Nghỉ ngắn đã hoàn thành", {
                body: "Đã đến lúc tập trung!",
                icon: "images/logo512.png",
                dir: "ltr",
              });
              break;
            case LONG_BREAK:
              setMinutes(LONG_BREAK_TIME);
              setSeconds(0);

              // Gửi thông báo
              notification = new Notification("Nghỉ dài đã hoàn thành", {
                body: "Đã đến lúc tập trung!",
                icon: "images/logo512.png",
                dir: "ltr",
              });
              break;
            default:
              break;
          }

          // Phát âm thanh kết thúc Pomodoro
          alarmAudio.play();
        } else if (seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
        switch (mode) {
          case POMODORO:
            totalSeconds = minutes * 60 + seconds;
            totalSecondsInMode = POMODORO_TIME * 60; // 25 phút cho Pomodoro
            break;
          case SHORT_BREAK:
            totalSeconds =
              SHORT_BREAK_TIME * 60 -
              (SHORT_BREAK_TIME * 60 - (minutes * 60 + seconds)); // Thời gian thực tế đã trôi qua trong 5 phút nghỉ ngắn
            totalSecondsInMode = SHORT_BREAK_TIME * 60; // 5 phút cho Short Break
            break;
          case LONG_BREAK:
            totalSeconds =
              LONG_BREAK_TIME * 60 -
              (LONG_BREAK_TIME * 60 - (minutes * 60 + seconds)); // Thời gian thực tế đã trôi qua trong 15 phút nghỉ dài
            totalSecondsInMode = LONG_BREAK_TIME * 60; // 15 phút cho Long Break
            break;
          default:
            break;
        }

        const newValue =
          ((totalSecondsInMode - totalSeconds) / totalSecondsInMode) * 100;
        setProgressBarValue(newValue);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, minutes, seconds, mode]);

  useEffect(() => {
    updateTitle(minutes, seconds, mode);
  }, [mode, minutes, seconds]);

  const toggleTimer = () => {
    buttonSound.play();
    if (isRunning) {
      setIsRunning(false); // Đặt trạng thái timer về tạm dừng
    } else {
      if (minutes === 0 && seconds === 0) {
        // Đặt lại thời gian về mặc định
        setMinutes(minutes);
        setSeconds(0);
      }
      setIsRunning(true); // Đặt trạng thái timer về đang chạy
    }
  };

  const resetTimer = () => {
    buttonSound.play();
    setIsRunning(false); // Đặt lại trạng thái timer

    // Cập nhật thời gian
    switch (mode) {
      case POMODORO:
        setMinutes(POMODORO_TIME);
        break;
      case SHORT_BREAK:
        setMinutes(SHORT_BREAK_TIME);
        break;
      case LONG_BREAK:
        setMinutes(LONG_BREAK_TIME);
        break;
      default:
        break;
    }
    setSeconds(0);

    // Cập nhật giá trị progressBarValue
    setProgressBarValue(0);
  };

  const switchMode = (event, newMode) => {
    // Chọn thời gian mặc định cho các chế độ
    let defaultMinutes;
    let defaultSeconds;
    switch (newMode) {
      case POMODORO:
        defaultMinutes = POMODORO_TIME;
        defaultSeconds = 0;
        break;
      case SHORT_BREAK:
        defaultMinutes = SHORT_BREAK_TIME;
        defaultSeconds = 0;
        break;
      case LONG_BREAK:
        defaultMinutes = LONG_BREAK_TIME;
        defaultSeconds = 0;
        break;
      default:
        break;
    }

    // Ngừng timer nếu đang chạy
    setIsRunning(false);

    // Cập nhật chế độ và thời gian
    setMode(newMode);
    setMinutes(defaultMinutes);
    setSeconds(defaultSeconds);

    // Cập nhật giá trị progressBarValue
    setProgressBarValue(0);
  };

  return (
    <main>
      <Header mode={mode} />
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
        <CircularProgressWithLabel
          minutes={minutes}
          seconds={seconds}
          variant="determinate"
          value={progressBarValue}
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={toggleTimer}
            color="secondary"
          >
            {isRunning ? PAUSE : START}
          </Button>
          <Button onClick={resetTimer} size="large" color="secondary">
            {RESET}
          </Button>
        </Stack>
        <Typography
          sx={{
            mt: 2,
          }}
          variant="overline"
          display="block"
          gutterBottom
          color="secondary"
        >
          {mode === POMODORO ? TIME_TO_FOCUS : TIME_FOR_A_BREAK}
        </Typography>
      </Box>
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Phương pháp Pomodoro là gì?
          </Typography>
          <Typography variant="body1" component="blockquote">
            Phương pháp Pomodoro là một phương pháp quản lý thời gian được phát
            triển bởi Francesco Cirillo vào cuối những năm 1980. Nó sử dụng đồng
            hồ bấm giờ trong bếp để chia công việc thành các khoảng thời gian,
            thường là 25 phút, giữa mỗi khoảng một thời gian nghỉ ngơi ngắn. Mỗi
            khoảng thời gian được gọi là một pomodoro, bắt nguồn từ tiếng Ý có
            nghĩa là cà chua, theo tên đồng hồ bấm giờ dùng trong bếp hình quả
            cà chua mà Cirillo đã sử dụng khi còn là sinh viên đại học. —{" "}
            <Link href="https://vi.wikipedia.org/wiki/Ph%C6%B0%C6%A1ng_ph%C3%A1p_Pomodoro">
              Phương pháp Pomodoro, Wikipedia
            </Link>
          </Typography>
        </Box>
      </Container>
    </main>
  );
}

export default Pomodoro;
