import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Stack } from "@mui/material";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import {
  POMODORO,
  SHORT_BREAK,
  LONG_BREAK,
  TIME_FOR_A_BREAK,
  TIME_TO_FOCUS,
  START,
  PAUSE,
  RESET,
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
import { updateTitle, isMobileDevice } from "./helpers";
import { player } from "./player";
import { useSelector } from "react-redux";

const buttonSound = player({
  asset: "audio/button-press.wav",
  volume: 0.5,
});

const alarmAudio = player({
  asset: ALARM_DIGITAL,
  volume: 0.5,
});

const tickingAudio = player({
  asset: TICKING_NONE,
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
  const pomodoroTime = useSelector((state) => state.settings.pomodoroTime);
  const shortBreakTime = useSelector((state) => state.settings.shortBreakTime);
  const longBreakTime = useSelector((state) => state.settings.longBreakTime);
  const volume = useSelector((state) => state.settings.volume);
  const alarmSoundType = useSelector((state) => state.settings.alarmSoundType);
  const tickingSoundType = useSelector((state) => state.settings.tickingSoundType);

  const [minutes, setMinutes] = useState(pomodoroTime); // Khai báo giá trị ban đầu cho minutes
  const [seconds, setSeconds] = useState(0); // Khai báo giá trị ban đầu cho seconds
  const [isRunning, setIsRunning] = useState(false); // Thêm biến để theo dõi trạng thái của timer

  const timerRef = useRef(null);
  const currentDurationRef = useRef(0);

  const [mode, setMode] = useState(POMODORO); // Mặc định là Pomodoro
  const [progressBarValue, setProgressBarValue] = useState(0);
  useEffect(() => {
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
          if (permission === "granted") {
            console.log("Quyền thông báo đã được cấp.");
          } else {
            console.log("Quyền thông báo bị từ chối.");
          }
        });
      }
    }
  }, []); // [] đảm bảo rằng useEffect chỉ chạy một lần khi component được tạo ra lần đầu

  function sendNotification(title, body) {
    // Kiểm tra xem trình duyệt hỗ trợ API Notification không
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
            console.log(
              "Vui lòng cho phép thông báo để sử dụng tính năng này."
            );
          }
        });
      }
    } else {
      // Trình duyệt không hỗ trợ API Notification
      console.log("Trình duyệt của bạn không hỗ trợ thông báo.");
    }
  }

  const handleTimerEnd = () => {
    setProgressBarValue(0); // Cập nhật giá trị progressBarValue
    // Thực hiện các hành động sau khi đếm ngược kết thúc
    // Ví dụ: Hiển thị thông báo và phát âm thanh
    switch (mode) {
      case POMODORO:
        // Gửi thông báo
        sendNotification("Pomodoro kết thúc", "Hãy nghỉ ngắn 5 phút!");
        setMinutes(pomodoroTime);
        setSeconds(0);
        break;
      case SHORT_BREAK:
        // Gửi thông báo
        sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
        setMinutes(shortBreakTime);
        setSeconds(0);
        break;
      case LONG_BREAK:
        // Gửi thông báo
        sendNotification("Nghỉ kết thúc", "Bắt đầu Pomodoro tiếp theo!");
        setMinutes(longBreakTime);
        setSeconds(0);
        break;
      default:
        break;
    }
    // playSound();
    alarmAudio.play();
    // Thay đổi mode (Pomodoro, Short Break, Long Break) nếu cần
    // Ví dụ: Nếu đang ở Pomodoro, chuyển sang Short Break
    // switchMode();
  };

  const updateTimer = (duration) => {
    setMinutes(Math.floor(duration / 60));
    setSeconds(duration % 60);
  };

  const handleCountdown = () => {
    let totalSecondsInMode;
    if (currentDurationRef.current > 0) {
      currentDurationRef.current -= 1;
      switch (mode) {
        case POMODORO:
          totalSecondsInMode = pomodoroTime * 60; // 25 phút cho Pomodoro
          break;
        case SHORT_BREAK:
          totalSecondsInMode = shortBreakTime * 60; // 5 phút cho Short Break
          break;
        case LONG_BREAK:
          totalSecondsInMode = longBreakTime * 60; // 15 phút cho Long Break
          break;
        default:
          break;
      }
      console.log('totalSecondsInMode', totalSecondsInMode, 'pomodoroTime', pomodoroTime);
      const progress =
        ((totalSecondsInMode - currentDurationRef.current) /
          totalSecondsInMode) *
        100;
      setProgressBarValue(progress);

      updateTimer(currentDurationRef.current);
    } else {
      clearInterval(timerRef.current);
      setIsRunning(false);
      handleTimerEnd();
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (tickingSoundType !== 'TICKING_NONE') {
        tickingAudio.play();
        console.log('tickingSoundType play');
      }
      timerRef.current = setInterval(handleCountdown, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    switch (alarmSoundType) {
      case "ALARM_BELL":
        alarmAudio.setAudio(ALARM_BELL);
        break;
      case "ALARM_BIRD":
        alarmAudio.setAudio(ALARM_BIRD);
        break;
      case "ALARM_DIGITAL":
        alarmAudio.setAudio(ALARM_DIGITAL);
        break;
      case "ALARM_KITCHEN":
        alarmAudio.setAudio(ALARM_KITCHEN);
        break;
      case "ALARM_WOOD":
        alarmAudio.setAudio(ALARM_WOOD);
        break;
      default:
        break;
    }
  }, [alarmSoundType]);

  useEffect(() => {
    switch (tickingSoundType) {
      case "TICKING_FAST":
        tickingAudio.setAudio(TICKING_FAST);
        break;
      case "TICKING_SLOW":
        tickingAudio.setAudio(TICKING_SLOW);
        break;
      case "WHITE_NOISE":
        tickingAudio.setAudio(WHITE_NOISE);
        break;
      case "BROWN_NOISE":
        tickingAudio.setAudio(BROWN_NOISE);
        break;
      case "TICKING_NONE":
      default:
        break;
    }
  }, [tickingSoundType]);

  useEffect(() => {
    alarmAudio.setVolume(volume);
    tickingAudio.setVolume(volume);
  }, [volume]);

  // Sử dụng useEffect để cập nhật giá trị minutes và seconds khi giá trị thay đổi
  useEffect(() => {
    console.log("pomodoroTime", pomodoroTime, 'minutes', minutes);
    setMinutes(pomodoroTime);
    setSeconds(0);
  }, [pomodoroTime]);

  // useEffect(() => {
  //   setMinutes(shortBreakTime);
  //   setSeconds(0);
  // }, [shortBreakTime]);

  // useEffect(() => {
  //   setMinutes(longBreakTime);
  //   setSeconds(0);
  // }, [longBreakTime]);

  useEffect(() => {
    if (!isMobileDevice()) {
      updateTitle(minutes, seconds, mode);
    }
  }, [mode, minutes, seconds]);

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      // Tính tổng thời gian hiện tại (minutes và seconds) thành giây
      const totalSeconds = minutes * 60 + seconds;
      currentDurationRef.current = totalSeconds;
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    buttonSound.play();
    setIsRunning(false); // Đặt lại trạng thái timer

    // Cập nhật thời gian
    switch (mode) {
      case POMODORO:
        setMinutes(pomodoroTime);
        break;
      case SHORT_BREAK:
        setMinutes(shortBreakTime);
        break;
      case LONG_BREAK:
        setMinutes(longBreakTime);
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
        defaultMinutes = pomodoroTime;
        defaultSeconds = 0;
        break;
      case SHORT_BREAK:
        defaultMinutes = shortBreakTime;
        defaultSeconds = 0;
        break;
      case LONG_BREAK:
        defaultMinutes = longBreakTime;
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
          <Typography variant="h6" component="h2" gutterBottom>
            Một số lý do tại sao nên sử dụng kỹ thuật Pomodoro
          </Typography>
          <Box
            sx={{
              px: 2,
            }}
            component="ul"
          >
            <Box component="li">
              <strong>Tăng sự tập trung</strong>: Kỹ thuật Pomodoro yêu cầu bạn
              làm việc hoặc học tập trong khoảng thời gian ngắn và giới hạn
              (thường là 25 phút). Điều này giúp bạn tập trung tối đa vào công
              việc trong khoảng thời gian đó.
            </Box>
            <Box component="li">
              <strong>Giảm căng thẳng và mệt mỏi</strong>: Việc chia công việc
              thành các khoảng thời gian ngắn kết hợp với các khoảng thời gian
              nghỉ ngắn (như 5 phút) hoặc dài hơn (như 15 phút) giúp bạn tránh
              căng thẳng và mệt mỏi.
            </Box>
            <Box component="li">
              <strong>Tăng năng suất</strong>: Pomodoro giúp bạn làm việc hiệu
              quả hơn bằng cách tạo áp lực thời gian. Việc hoàn thành công việc
              trong khoảng thời gian ngắn có thể thúc đẩy bạn hoàn thành nhiều
              công việc hơn trong một ngày.
            </Box>
            <Box component="li">
              <strong>Dễ dàng theo dõi thời gian</strong>: Pomodoro có thời gian
              cố định (25 phút) nên bạn có thể dễ dàng theo dõi thời gian và
              đánh giá tiến độ công việc của mình.
            </Box>
            <Box component="li">
              <strong>Hỗ trợ quản lý thời gian</strong>: Bằng cách sử dụng
              Pomodoro, bạn có thể quản lý thời gian của mình một cách hiệu quả
              hơn. Bạn biết được mình đã làm việc trong bao nhiêu thời gian và
              có thể điều chỉnh thời gian nghỉ để đảm bảo sự cân bằng giữa làm
              việc và thư giãn.
            </Box>
            <Box component="li">
              <strong>Khắc phục tình trạng trì hoãn</strong>: Kỹ thuật Pomodoro
              khuyến khích bạn bắt đầu công việc ngay lập tức và làm việc liên
              tục trong khoảng thời gian Pomodoro. Điều này có thể giúp bạn vượt
              qua tình trạng trì hoãn.
            </Box>
            <Box component="li">
              <strong>Dễ áp dụng</strong>: Pomodoro không đòi hỏi công cụ phức
              tạp hoặc kỹ thuật đặc biệt. Bạn chỉ cần một bộ hẹn giờ hoặc một
              ứng dụng đếm giờ đơn giản để bắt đầu.
            </Box>
            <Box component="li">
              <strong>Cải thiện quản lý dự án</strong>: Pomodoro có thể áp dụng
              cho quản lý dự án để chia dự án thành các nhiệm vụ nhỏ hơn và theo
              dõi tiến trình một cách cụ thể.
            </Box>
          </Box>

          <Typography variant="h6" component="h2" gutterBottom>
            5 bước sử dụng phương pháp Pomodoro để tăng hiệu suất và quản lý
            thời gian hiệu quả
          </Typography>
          <Box
            sx={{
              px: 2,
            }}
            component="ul"
          >
            <Box component="li">
              <strong>Chọn công việc cần thực hiện</strong>: Bước đầu tiên là
              xác định công việc hoặc nhiệm vụ bạn muốn hoàn thành. Đảm bảo công
              việc này cụ thể và có thể thực hiện trong một khoảng thời gian
              tương đối ngắn.
            </Box>
            <Box component="li">
              <strong>Thiết lập hẹn giờ Pomodoro</strong>: Bắt đầu một đếm giờ
              Pomodoro trong khoảng thời gian tối ưu (thường là 25 phút). Khi
              bắt đầu, tập trung 100% vào công việc mà bạn đã chọn và cố gắng
              hoàn thành nhiệm vụ đó trong khoảng thời gian Pomodoro.
            </Box>
            <Box component="li">
              <strong>Làm việc cho đến khi hết thời gian</strong>: Trong khoảng
              thời gian Pomodoro, làm việc không gián đoạn và tập trung hoàn
              toàn vào công việc. Tránh xem điện thoại, mạng xã hội hoặc bất kỳ
              sự xao lệnh nào khác.
            </Box>
            <Box component="li">
              <strong>Khi Pomodoro kết thúc, nghỉ ngắn</strong>: Sau khi
              Pomodoro kết thúc (ví dụ, sau 25 phút làm việc), hãy chấp nhận một
              khoảng thời gian ngắn nghỉ ngơi (thường là 5 phút). Sử dụng thời
              gian này để thư giãn, đứng dậy, căn chỉnh và chuẩn bị cho Pomodoro
              tiếp theo.
            </Box>
            <Box component="li">
              <strong>Lặp lại hoặc nghỉ ngắn dài</strong>: Sau khi hoàn thành
              một chu kỳ Pomodoro và nghỉ ngắn, bạn có thể lặp lại bước 2 và 3
              cho công việc tiếp theo. Sau bốn chu kỳ Pomodoro liên tiếp, bạn có
              thể thực hiện một khoảng nghỉ dài hơn (thường là 15-30 phút) để
              thư giãn hoàn toàn.
            </Box>
          </Box>

          <Typography variant="h6" component="h2" gutterBottom>
            Sau khi một chu kỳ Pomodoro kết thúc bạn có thể làm gì?
          </Typography>
          <Box
            sx={{
              px: 2,
            }}
            component="ul"
          >
            <Box component="li">
              <strong>Nghỉ ngắn</strong>: Thực hiện một khoảng nghỉ ngắn ngay
              sau khi Pomodoro kết thúc. Thời gian nghỉ ngắn thường là 5 phút.
              Trong khoảng thời gian này, bạn có thể đứng dậy, vận động cơ thể,
              căn chỉnh lại tư duy, và lấy một hơi để sẵn sàng cho Pomodoro tiếp
              theo.
            </Box>
            <Box component="li">
              <strong>Ghi chép công việc</strong>: Sử dụng thời gian nghỉ ngắn
              để ghi chép công việc đã hoàn thành trong Pomodoro trước đó. Điều
              này giúp bạn theo dõi tiến trình công việc và cải thiện khả năng
              quản lý thời gian.
            </Box>
            <Box component="li">
              <strong>Nghỉ dài (Long Break)</strong>: Sau khi hoàn thành một số
              chu kỳ Pomodoro (thường sau bốn), bạn có thể thực hiện một khoảng
              nghỉ dài hơn, thường là từ 15 đến 30 phút. Trong khoảng thời gian
              này, bạn có thể thư giãn hoàn toàn, ăn một bữa nhẹ, ra ngoài dạo
              chơi, hoặc làm bất kỳ điều gì giúp bạn lấy lại năng lượng.
            </Box>
            <Box component="li">
              <strong>Đánh giá và điều chỉnh</strong>: Sử dụng thời gian nghỉ để
              xem xét công việc bạn đã hoàn thành và xem xét liệu bạn có cần
              điều chỉnh mục tiêu hoặc ưu tiên công việc không. Điều này giúp
              bạn đảm bảo bạn đang làm việc vào hướng đúng.
            </Box>
            <Box component="li">
              <strong>Nắm vận động</strong>: Trong khoảng nghỉ, bạn có thể thực
              hiện một số động tác nhẹ để giảm căng thẳng cơ bắp và tăng tuần
              hoàn máu.
            </Box>
            <Box component="li">
              <strong>Nắm vận động</strong>: Trong khoảng nghỉ, bạn có thể thực
              hiện một số động tác nhẹ để giảm căng thẳng cơ bắp và tăng tuần
              hoàn máu.
            </Box>
            <Box component="li">
              <strong>Tận dụng thời gian nghỉ</strong>: Sử dụng thời gian nghỉ
              để làm những công việc nhẹ nhàng hoặc thư giãn. Ví dụ, bạn có thể
              lập lịch gọi điện thoại, kiểm tra email, hoặc đọc một chút.
            </Box>
          </Box>
        </Box>
      </Container>
    </main>
  );
}

export default Pomodoro;
