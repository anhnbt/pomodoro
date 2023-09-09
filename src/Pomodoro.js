/*global chrome*/
import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

function Pomodoro() {
  const [minutes, setMinutes] = useState(25); // Khai báo giá trị ban đầu cho minutes
  const [seconds, setSeconds] = useState(0); // Khai báo giá trị ban đầu cho seconds
  const [isRunning, setIsRunning] = useState(false); // Thêm biến để theo dõi trạng thái của timer

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "timerCompleted") {
        setIsRunning(false); // Đặt lại trạng thái timer
        // Đặt lại thời gian về mặc định
        setMinutes(25);
        setSeconds(0);

        // Gửi thông điệp để dừng bộ đếm thời gian từ popup đến background script
        chrome.runtime.sendMessage({
          action: "stopTimer",
        });
      } else if (request.action === "updateDisplay") {
        setMinutes(request.minutes); // Cập nhật giá trị minutes từ background.js
        setSeconds(request.seconds); // Cập nhật giá trị seconds từ background.js
        setIsRunning(request.isRunning);
      }
    });
  }, []);

  const toggleTimer = () => {
    if (isRunning) {
      chrome.runtime.sendMessage({
        action: "pauseTimer",
      }); // Gửi thông điệp để tạm dừng thời gian
      setIsRunning(false); // Đặt trạng thái timer về tạm dừng
    } else {
      if (minutes === 0 && seconds === 0) {
        // Đặt lại thời gian về mặc định
        setMinutes(25);
        setSeconds(0);
      }
      chrome.runtime.sendMessage({
        action: "startTimer",
      }); // Bắt đầu thời gian từ nền
      setIsRunning(true); // Đặt trạng thái timer về đang chạy
    }
  };

  const resetTimer = () => {
    setIsRunning(false); // Đặt lại trạng thái timer
    setMinutes(25);
    setSeconds(0);
    chrome.runtime.sendMessage({
      action: "resetTimer",
    }); // Gửi thông điệp để reset thời gian
  };

  // Tính giá trị phần trăm từ số phút và số giây còn lại
  const totalSeconds = minutes * 60 + seconds;
  const progressBarValue = ((25 * 60 - totalSeconds) / (25 * 60)) * 100;

  return (
    <main>
      <Box
        mt={2}
        sx={{
          bgcolor: "background.paper",
          pt: 2,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <CircularProgressWithLabel
          minutes={minutes}
          seconds={seconds}
          variant="determinate"
          value={progressBarValue}
        />
      </Box>
      <Stack sx={{ pb: 2 }} direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" onClick={toggleTimer}>
          {isRunning ? "Tạm dừng" : "Bắt đầu"}
        </Button>
        <Button onClick={resetTimer}>Reset</Button>
      </Stack>
    </main>
  );
}

export default Pomodoro;
