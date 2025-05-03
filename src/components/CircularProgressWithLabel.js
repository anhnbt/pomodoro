import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { formatTime } from '../utils/helperFunctions';
import { motion } from 'framer-motion';

export default function CircularProgressWithLabel(props) {
  const prevMinutes = React.useRef(props.minutes);
  const prevSeconds = React.useRef(props.seconds);

  // Xác định nếu số thay đổi để tạo animation
  const minutesChanged = prevMinutes.current !== props.minutes;
  const secondsChanged = prevSeconds.current !== props.seconds;

  // Cập nhật reference cho lần render tiếp theo
  React.useEffect(() => {
    prevMinutes.current = props.minutes;
    prevSeconds.current = props.seconds;
  }, [props.minutes, props.seconds]);

  return (
    <Box sx={{ position: 'relative', py: 2, display: 'inline-flex' }}>
      <motion.div
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CircularProgress
          color="secondary"
          size={'20rem'}
          thickness={1.5}
          variant="determinate"
          {...props}
          sx={{
            transition: 'all 0.5s ease-in-out',
          }}
        />
      </motion.div>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <motion.div
            key={`min-${props.minutes}`}
            initial={{
              y: minutesChanged ? 10 : 0,
              opacity: minutesChanged ? 0 : 1,
            }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="timer" component="span" color="secondary">
              {props.minutes.toString().padStart(2, '0')}
            </Typography>
          </motion.div>
          <Typography variant="timer" component="span" color="secondary">
            :
          </Typography>
          <motion.div
            key={`sec-${props.seconds}`}
            initial={{
              y: secondsChanged ? 10 : 0,
              opacity: secondsChanged ? 0 : 1,
            }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="timer" component="span" color="secondary">
              {props.seconds.toString().padStart(2, '0')}
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
