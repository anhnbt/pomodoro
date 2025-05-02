import React from 'react';
import { useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Statistics = () => {
  const statistics = useSelector((state) => state.settings.statistics);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" sx={{ py: 2 }}>
        Lịch sử Pomodoro
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Thời gian</TableCell>
            <TableCell align="center">Chế độ</TableCell>
            <TableCell align="center">Thời lượng (phút)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statistics.length > 0 ? (
            statistics.map((session, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  {new Date(session.timestamp).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {session.mode === 'pomodoro'
                    ? 'Pomodoro'
                    : session.mode === 'shortBreak'
                    ? 'Nghỉ ngắn'
                    : 'Nghỉ dài'}
                </TableCell>
                <TableCell align="center">{session.duration}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={3}>
                Chưa có dữ liệu.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Statistics;
