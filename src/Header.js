import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Settings from "./Settings";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Header(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar position="static"
        sx={{
          backgroundColor: `${props.mode}.main`,
        }}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Pomodoro Vietnam
          </Typography>
          <IconButton
            color="inherit"
            aria-label="Settings"
            onClick={handleClickOpen}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Settings open={open} onClose={handleClose} />
    </div>
  );
}
