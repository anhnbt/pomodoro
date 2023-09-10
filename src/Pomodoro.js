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
  DIGITAL_SOUND,
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
              Tăng sự tập trung: Kỹ thuật Pomodoro yêu cầu bạn làm việc hoặc học
              tập trong khoảng thời gian ngắn và giới hạn (thường là 25 phút).
              Điều này giúp bạn tập trung tối đa vào công việc trong khoảng thời
              gian đó.
            </Box>
            <Box component="li">
              Giảm căng thẳng và mệt mỏi: Việc chia công việc thành các khoảng
              thời gian ngắn kết hợp với các khoảng thời gian nghỉ ngắn (như 5
              phút) hoặc dài hơn (như 15 phút) giúp bạn tránh căng thẳng và mệt
              mỏi.
            </Box>
            <Box component="li">
              Tăng năng suất: Pomodoro giúp bạn làm việc hiệu quả hơn bằng cách
              tạo áp lực thời gian. Việc hoàn thành công việc trong khoảng thời
              gian ngắn có thể thúc đẩy bạn hoàn thành nhiều công việc hơn trong
              một ngày.
            </Box>
            <Box component="li">
              Dễ dàng theo dõi thời gian: Pomodoro có thời gian cố định (25
              phút) nên bạn có thể dễ dàng theo dõi thời gian và đánh giá tiến
              độ công việc của mình.
            </Box>
            <Box component="li">
              Hỗ trợ quản lý thời gian: Bằng cách sử dụng Pomodoro, bạn có thể
              quản lý thời gian của mình một cách hiệu quả hơn. Bạn biết được
              mình đã làm việc trong bao nhiêu thời gian và có thể điều chỉnh
              thời gian nghỉ để đảm bảo sự cân bằng giữa làm việc và thư giãn.
            </Box>
            <Box component="li">
              Khắc phục tình trạng trì hoãn: Kỹ thuật Pomodoro khuyến khích bạn
              bắt đầu công việc ngay lập tức và làm việc liên tục trong khoảng
              thời gian Pomodoro. Điều này có thể giúp bạn vượt qua tình trạng
              trì hoãn.
            </Box>
            <Box component="li">
              Dễ áp dụng: Pomodoro không đòi hỏi công cụ phức tạp hoặc kỹ thuật
              đặc biệt. Bạn chỉ cần một bộ hẹn giờ hoặc một ứng dụng đếm giờ đơn
              giản để bắt đầu.
            </Box>
            <Box component="li">
              Cải thiện quản lý dự án: Pomodoro có thể áp dụng cho quản lý dự án
              để chia dự án thành các nhiệm vụ nhỏ hơn và theo dõi tiến trình
              một cách cụ thể.
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
              Chọn công việc cần thực hiện: Bước đầu tiên là xác định công việc
              hoặc nhiệm vụ bạn muốn hoàn thành. Đảm bảo công việc này cụ thể và
              có thể thực hiện trong một khoảng thời gian tương đối ngắn.
            </Box>
            <Box component="li">
            Thiết lập hẹn giờ Pomodoro: Bắt đầu một đếm giờ Pomodoro trong khoảng thời gian tối ưu (thường là 25 phút). Khi bắt đầu, tập trung 100% vào công việc mà bạn đã chọn và cố gắng hoàn thành nhiệm vụ đó trong khoảng thời gian Pomodoro.
            </Box>
            <Box component="li">
            Làm việc cho đến khi hết thời gian: Trong khoảng thời gian Pomodoro, làm việc không gián đoạn và tập trung hoàn toàn vào công việc. Tránh xem điện thoại, mạng xã hội hoặc bất kỳ sự xao lệnh nào khác.
            </Box>
            <Box component="li">
            Khi Pomodoro kết thúc, nghỉ ngắn: Sau khi Pomodoro kết thúc (ví dụ, sau 25 phút làm việc), hãy chấp nhận một khoảng thời gian ngắn nghỉ ngơi (thường là 5 phút). Sử dụng thời gian này để thư giãn, đứng dậy, căn chỉnh và chuẩn bị cho Pomodoro tiếp theo.
            </Box>
            <Box component="li">
            Lặp lại hoặc nghỉ ngắn dài: Sau khi hoàn thành một chu kỳ Pomodoro và nghỉ ngắn, bạn có thể lặp lại bước 2 và 3 cho công việc tiếp theo. Sau bốn chu kỳ Pomodoro liên tiếp, bạn có thể thực hiện một khoảng nghỉ dài hơn (thường là 15-30 phút) để thư giãn hoàn toàn.
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
            Nghỉ ngắn: Thực hiện một khoảng nghỉ ngắn ngay sau khi Pomodoro kết thúc. Thời gian nghỉ ngắn thường là 5 phút. Trong khoảng thời gian này, bạn có thể đứng dậy, vận động cơ thể, căn chỉnh lại tư duy, và lấy một hơi để sẵn sàng cho Pomodoro tiếp theo.
            </Box>
            <Box component="li">
            Ghi chép công việc: Sử dụng thời gian nghỉ ngắn để ghi chép công việc đã hoàn thành trong Pomodoro trước đó. Điều này giúp bạn theo dõi tiến trình công việc và cải thiện khả năng quản lý thời gian.
            </Box>
            <Box component="li">
            Nghỉ dài (Long Break): Sau khi hoàn thành một số chu kỳ Pomodoro (thường sau bốn), bạn có thể thực hiện một khoảng nghỉ dài hơn, thường là từ 15 đến 30 phút. Trong khoảng thời gian này, bạn có thể thư giãn hoàn toàn, ăn một bữa nhẹ, ra ngoài dạo chơi, hoặc làm bất kỳ điều gì giúp bạn lấy lại năng lượng.
            </Box>
            <Box component="li">
            Đánh giá và điều chỉnh: Sử dụng thời gian nghỉ để xem xét công việc bạn đã hoàn thành và xem xét liệu bạn có cần điều chỉnh mục tiêu hoặc ưu tiên công việc không. Điều này giúp bạn đảm bảo bạn đang làm việc vào hướng đúng.
            </Box>
            <Box component="li">
            Nắm vận động: Trong khoảng nghỉ, bạn có thể thực hiện một số động tác nhẹ để giảm căng thẳng cơ bắp và tăng tuần hoàn máu.
            </Box>
            <Box component="li">
            Nắm vận động: Trong khoảng nghỉ, bạn có thể thực hiện một số động tác nhẹ để giảm căng thẳng cơ bắp và tăng tuần hoàn máu.
            </Box>
            <Box component="li">
            Tận dụng thời gian nghỉ: Sử dụng thời gian nghỉ để làm những công việc nhẹ nhàng hoặc thư giãn. Ví dụ, bạn có thể lập lịch gọi điện thoại, kiểm tra email, hoặc đọc một chút.
            </Box>
          </Box>
        </Box>
      </Container>
    </main>
  );
}

export default Pomodoro;
