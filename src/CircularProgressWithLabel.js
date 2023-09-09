import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function CircularProgressWithLabel(props) {

  return (
    <Box sx={{ position: "relative", py: 2, display: "inline-flex" }}>
      <CircularProgress color="secondary" size={"20rem"} thickness={1} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="timer" component="div" color="secondary">
          {props.minutes.toString().padStart(2, "0")}:
          {props.seconds.toString().padStart(2, "0")}
        </Typography>
      </Box>
    </Box>
  );
}
