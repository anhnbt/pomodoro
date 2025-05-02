import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Box, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebIcon from '@mui/icons-material/Web';

export default function Footer() {
  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
      }}
      component="footer"
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://www.anhnbt.com/">
            AnhNBT
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <IconButton
            href="https://github.com/anhnbt/pomodoro"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            href="https://pomodoro.codingwithwanbi.com/"
            target="_blank"
            rel="noopener"
            aria-label="Website"
          >
            <WebIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
