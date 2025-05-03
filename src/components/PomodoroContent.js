import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Timer from './Timer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import { setMode, addStatistics } from '../redux/settingsSlice';
import { POMODORO, SHORT_BREAK, LONG_BREAK } from '../constants/appConfig';
import { player } from '../utils/player';
import { useHandleTimerEnd } from '../utils/timerHooks';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Slide from '@mui/material/Slide';

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#fff',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
);

const clickSound = player({
  asset: 'audio/button-press.wav',
  volume: 0.5,
});

const MotionButton = motion(Button);

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
  const [showControls, setShowControls] = useState(true);
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const toggleTimer = useCallback(() => {
    const playClickSound = () => {
      clickSound.play();
    };

    setIsRunning((prevIsRunning) => {
      if (prevIsRunning) {
        tickingAudio.stop();
      } else if (tickingSound !== 'TICKING_NONE') {
        tickingAudio.play();
      }
      playClickSound();
      return !prevIsRunning;
    });
  }, [tickingAudio, tickingSound]);

  useEffect(() => {
    const handleSpacebarPress = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        toggleTimer();
      }
    };

    document.addEventListener('keydown', handleSpacebarPress);

    return () => {
      document.removeEventListener('keydown', handleSpacebarPress);
    };
  }, [toggleTimer]);

  const handleResetClick = useCallback(() => {
    setIsRunning(false);
    tickingAudio.stop();
    timerRef.current.reset();
    clickSound.play();
  }, [tickingAudio]);

  const handleAutoStart = useCallback(() => {
    clickSound.play();
    setIsRunning(true);
    if (tickingSound !== 'TICKING_NONE') {
      tickingAudio.play();
    }
  }, [clickSound, tickingAudio, tickingSound]);

  const switchMode = useCallback(
    (event, newMode) => {
      if (newMode === null) return;

      setIsRunning(false);
      tickingAudio.stop();

      dispatch(setMode(newMode));

      setShowControls(false);
      setTimeout(() => setShowControls(true), 300);
    },
    [dispatch, tickingAudio]
  );

  const handleTimerEnd = useHandleTimerEnd({
    alarmAudio,
    tickingAudio,
    handleResetClick: () => {
      setTimeout(() => handleResetClick(), 0);
    },
    handleAutoStart: () => {
      setTimeout(() => handleAutoStart(), 0);
    },
    autoStartEnabled,
    autoStartPomodoroEnabled,
    mode,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    dispatch,
  });

  useEffect(() => {
    if (isRunning) {
      timerRef.current.start();
    } else {
      timerRef.current.pause();
    }
  }, [isRunning]);

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  return (
    <Box
      sx={{
        py: 2,
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: `${mode}.main`,
        transition: 'background-color 0.5s ease-in-out',
      }}
    >
      <StyledTabs
        textColor="secondary"
        indicatorColor="secondary"
        value={mode}
        onChange={switchMode}
        centered
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            fontWeight: 500,
            minWidth: 100,
            borderRadius: '20px',
            mx: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        }}
      >
        <StyledTab value={POMODORO} label="Pomodoro" />
        <StyledTab value={SHORT_BREAK} label="Nghỉ ngắn" />
        <StyledTab value={LONG_BREAK} label="Nghỉ dài" />
      </StyledTabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          tickingSound={tickingSound}
          handleResetClick={handleResetClick}
          handleAutoStart={handleAutoStart}
          onTimerEnd={handleTimerEnd}
        />
      </motion.div>

      <Slide
        direction="up"
        in={showControls}
        mountOnEnter
        unmountOnExit
        timeout={300}
      >
        <Box className="controls" sx={{ mt: 4 }}>
          <Stack direction="row" spacing={3} justifyContent="center">
            <MotionButton
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              variant="contained"
              size="large"
              onClick={toggleTimer}
              color="secondary"
              sx={{
                borderRadius: '50px',
                px: 4,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              }}
              endIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            >
              {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
            </MotionButton>

            <MotionButton
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={handleResetClick}
              size="large"
              color="secondary"
              sx={{
                borderRadius: '50px',
                minWidth: '110px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              startIcon={<RestartAltIcon />}
            >
              Đặt lại
            </MotionButton>
          </Stack>
        </Box>
      </Slide>
    </Box>
  );
}

export default React.memo(PomodoroContent);
