import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { setMode } from '../redux/settingsSlice';
import { POMODORO, SHORT_BREAK, LONG_BREAK } from '../constants/appConfig';
import { sendNotification } from '../utils/notifications';
import { updateTitle } from '../utils/helperFunctions';
import { useDispatch } from 'react-redux';
import { useHandleTimerEnd } from '../utils/timerHooks';

const Timer = (
  {
    pomodoroTime,
    longBreakTime,
    shortBreakTime,
    autoStartPomodoroEnabled,
    autoStartEnabled,
    handleResetClick,
    handleAutoStart,
    isRunning,
    mode,
    alarmAudio,
    tickingAudio,
    onTimerEnd,
  },
  ref
) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Tính toán thời gian ban đầu một lần duy nhất khi component mount
    return mode === POMODORO
      ? pomodoroTime * 60
      : mode === SHORT_BREAK
      ? shortBreakTime * 60
      : longBreakTime * 60;
  });

  const [progressBarValue, setProgressBarValue] = useState(0);
  const intervalRef = useRef(null);
  const totalTimeRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const tabHiddenTimeRef = useRef(null);
  const isTabVisibleRef = useRef(true);

  // Sử dụng useMemo để tính toán tổng thời gian và tránh tính toán lại không cần thiết
  const totalTime = useMemo(() => {
    const time =
      mode === POMODORO
        ? pomodoroTime * 60
        : mode === SHORT_BREAK
        ? shortBreakTime * 60
        : longBreakTime * 60;

    totalTimeRef.current = time;
    return time;
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  // Cập nhật tiêu đề tài liệu mỗi khi thời gian thay đổi
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    updateTitle(minutes, seconds, mode);
  }, [timeLeft, mode]);

  // Tính toán giá trị progress một cách hiệu quả
  const calculateProgress = useCallback(() => {
    return ((totalTimeRef.current - timeLeft) / totalTimeRef.current) * 100;
  }, [timeLeft]);

  useEffect(() => {
    setProgressBarValue(calculateProgress());
  }, [timeLeft, calculateProgress]);

  // Giữ tham chiếu đến phiên bản mới nhất của hàm onTimerEnd
  const onTimerEndRef = useRef(onTimerEnd);
  useEffect(() => {
    onTimerEndRef.current = onTimerEnd;
  }, [onTimerEnd]);

  // Giữ tham chiếu đến trạng thái chạy hiện tại
  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Cài đặt bộ đếm thời gian chính xác với khả năng chạy nền
  const startTimer = useCallback(() => {
    // Đảm bảo không có bộ đếm thời gian nào đang chạy trước khi khởi động mới
    if (intervalRef.current) {
      return; // Nếu đã có timer đang chạy, không làm gì thêm
    }

    // Đảm bảo không có timer nào đang chạy
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Thiết lập thời gian bắt đầu
    lastTimeRef.current = Date.now();

    // Sử dụng setInterval để chạy timer ngay cả khi tab không được focus
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;

      if (deltaTime >= 1000) {
        // Cập nhật thời gian mốc, điều chỉnh độ chính xác
        lastTimeRef.current = now - (deltaTime % 1000);

        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            onTimerEndRef.current();
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }
    }, 100); // Kiểm tra thường xuyên để đảm bảo đếm chính xác
  }, []);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    pauseTimer();
    setTimeLeft(totalTime);
    setProgressBarValue(0);
  }, [totalTime, pauseTimer]);

  // Xử lý sự kiện thay đổi khả năng hiển thị tab
  useEffect(() => {
    // Lưu trữ các refs cần thiết cho các hàm xử lý sự kiện
    const startTimerFn = startTimer;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab bị ẩn - lưu thời điểm ẩn
        isTabVisibleRef.current = false;
        tabHiddenTimeRef.current = Date.now();
      } else {
        // Tab được hiển thị lại
        isTabVisibleRef.current = true;

        // Đảm bảo không khởi tạo nhiều setInterval khi tab được hiển thị lại
        if (intervalRef.current) {
          return; // Nếu đã có timer đang chạy, không làm gì thêm
        }

        // Chỉ cập nhật thời gian nếu timer đang chạy và có thời điểm ẩn tab
        if (isRunningRef.current && tabHiddenTimeRef.current) {
          const elapsedSeconds = Math.floor(
            (Date.now() - tabHiddenTimeRef.current) / 1000
          );

          if (elapsedSeconds > 0) {
            // Dừng timer hiện tại
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Cập nhật thời gian còn lại
            setTimeLeft((prevTime) => {
              const newTime = Math.max(0, prevTime - elapsedSeconds);

              if (newTime <= 0) {
                // Kết thúc timer nếu đã hết thời gian
                setTimeout(() => onTimerEndRef.current(), 0);
                return 0;
              }

              // Khởi động lại timer sau khi cập nhật thời gian
              if (isRunningRef.current) {
                // Sử dụng setTimeout để đảm bảo state đã được cập nhật
                setTimeout(() => {
                  if (isRunningRef.current && !intervalRef.current) {
                    startTimerFn();
                  }
                }, 0);
              }

              return newTime;
            });
          }
        }

        tabHiddenTimeRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startTimer]);

  // Cập nhật timeLeft khi mode hoặc thời gian thay đổi
  useEffect(() => {
    resetTimer();
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime, resetTimer]);

  // Tự động bắt đầu/dừng dựa trên props isRunning
  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [isRunning, startTimer, pauseTimer]);

  // Cung cấp phương thức cho parent component
  useEffect(() => {
    ref.current = {
      start: startTimer,
      pause: pauseTimer,
      reset: resetTimer,
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimer, pauseTimer, resetTimer]);

  return (
    <CircularProgressWithLabel
      minutes={Math.floor(timeLeft / 60)}
      seconds={timeLeft % 60}
      variant="determinate"
      value={progressBarValue}
    />
  );
};

export default React.memo(forwardRef(Timer));
