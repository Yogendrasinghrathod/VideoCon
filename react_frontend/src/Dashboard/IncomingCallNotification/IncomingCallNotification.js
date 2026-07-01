import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { clearIncomingCall } from "../../store/roomSlice";
import * as roomHandler from "../../realtimeCommunication/roomHandler";

const IncomingCallNotification = () => {
  const dispatch = useDispatch();
  const incomingCall = useSelector((state) => state.room.incomingCall);

  const handleAcceptCall = () => {
    if (incomingCall) {
      roomHandler.joinRoom(incomingCall.roomId);
      dispatch(clearIncomingCall());
    }
  };

  const handleRejectCall = () => {
    dispatch(clearIncomingCall());
  };

  if (!incomingCall) {
    return null;
  }

  return (
    <Dialog
      open={!!incomingCall}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "rgba(36, 37, 38, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", color: "white" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Incoming Call
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
        <Avatar
          sx={{ width: 80, height: 80, mb: 2, bgcolor: "#5865F2" }}
        >
          {incomingCall.callerUsername?.[0]?.toUpperCase() || "U"}
        </Avatar>
        <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
          {incomingCall.callerUsername}
        </Typography>
        <Typography variant="body2" sx={{ color: "#8e9297" }}>
          is calling you...
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
        <Button
          onClick={handleRejectCall}
          variant="contained"
          sx={{
            backgroundColor: "#ed4245",
            color: "white",
            borderRadius: "24px",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#c03537",
            },
          }}
        >
          Reject
        </Button>
        <Button
          onClick={handleAcceptCall}
          variant="contained"
          sx={{
            backgroundColor: "#3ba55c",
            color: "white",
            borderRadius: "24px",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#2d8a4a",
            },
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomingCallNotification;
