import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { getActions } from "../../store/actions/alertActions";
import store from "../../store/store";
import VideoContainer from "./VideoContainer";
import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import ResizeRoomButton from "./ResizeRoomButton";
import RoomButtons from "./RoomButtons/RoomButtons";
import { useTheme } from "@mui/material/styles";
import { Box, Slide, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MainContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.grey[900],
  boxShadow: theme.shadows[10],
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  border: `1px solid ${theme.palette.divider}`,
}));

const fullScreenRoomStyle = {
  width: "100%",
  height: "100vh",
  top: 0,
  left: 0,
  borderRadius: 0,
};

const minimizedRoomStyle = {
  width: "360px",
  height: "240px",
  bottom: "20px",
  right: "20px",
};

const ControlsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[800],
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ShareLinkContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.grey[800],
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  maxWidth: '400px',
  zIndex: 10,
  boxShadow: theme.shadows[5],
  border: `1px solid ${theme.palette.divider}`,
}));

const LinkInput = styled('input')(({ theme }) => ({
  background: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.common.white,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1),
  marginRight: theme.spacing(1),
  flex: 1,
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.875rem',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  }
}));

const PermissionRequestDialog = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[24],
  zIndex: 1300,
  minWidth: '300px',
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Room = ({ roomId }) => {
  const theme = useTheme();
  const [isRoomMinimized, setIsRoomMinimized] = useState(true);
  const [showShareLink, setShowShareLink] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [roomLink, setRoomLink] = useState("");
  const [showPermissionRequest, setShowPermissionRequest] = useState(false);
  const [requestingUser, setRequestingUser] = useState(null);
  const { isUserRoomCreator } = useSelector((state) => state.room);
  const socket = useSelector((state) => state.socket);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);

  useEffect(() => {
    if (!socket) {
      console.error('Socket is not initialized');
      return;
    }

    // Listen for room join requests
    const handleRoomJoinRequest = ({ userId, username }) => {
      setRequestingUser({ id: userId, username });
      setShowPermissionRequest(true);
    };

    socket.on('room-join-request', handleRoomJoinRequest);

    return () => {
      if (socket) {
        socket.off('room-join-request', handleRoomJoinRequest);
      }
    };
  }, [socket]);

  const handlePermissionResponse = (granted) => {
    if (!socket) {
      console.error('Socket is not initialized');
      return;
    }

    if (granted) {
      socket.emit('room-join-response', {
        userId: requestingUser.id,
        roomId,
        granted: true
      });
      setSnackbarMessage(`${requestingUser.username} has joined the room`);
      setSnackbarSeverity("success");
    } else {
      socket.emit('room-join-response', {
        userId: requestingUser.id,
        roomId,
        granted: false
      });
      setSnackbarMessage(`Denied ${requestingUser.username}'s request to join`);
      setSnackbarSeverity("error");
    }
    setShowPermissionRequest(false);
    setShowSnackbar(true);
  };

  // Generate room link when component mounts
  useEffect(() => {
    if (roomId) {
      const link = generateRoomLink(roomId);
      setRoomLink(link);
    }
  }, [roomId]);

  const generateRoomLink = (roomId) => {
    return `${window.location.origin}/room/${roomId}`;
  };

  const roomResizeHandler = () => {
    setIsRoomMinimized(!isRoomMinimized);
  };

  const handleShareClick = () => {
    if (!socket) {
      console.error('Socket is not initialized');
      return;
    }

    if (isUserRoomCreator) {
      setShowShareLink(!showShareLink);
    } else {
      const actions = getActions(store.dispatch);
      actions.openAlertMessage({
        alertType: "error",
        alertMessage: "Only room creator can share the room link",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink)
      .then(() => {
        setSnackbarMessage("Room link copied to clipboard!");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
        setShowCopiedAlert(true);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setSnackbarMessage("Failed to copy room link");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowSnackbar(false);
  };

  return (
    <MainContainer style={isRoomMinimized ? minimizedRoomStyle : fullScreenRoomStyle}>
      <Box sx={{ flex: 1, width: '100%', overflow: 'hidden', position: 'relative' }}>
        <VideoContainer />
        
        {/* Permission Request Dialog */}
        {showPermissionRequest && isUserRoomCreator && (
          <PermissionRequestDialog>
            <Typography variant="h6" gutterBottom>
              Room Join Request
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {requestingUser?.username} wants to join your room
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => handlePermissionResponse(false)}
              >
                Deny
              </Button>
              <Button
                variant="contained"
                onClick={() => handlePermissionResponse(true)}
              >
                Allow
              </Button>
            </Box>
          </PermissionRequestDialog>
        )}
        
        {/* Share Link Popup */}
        {showShareLink && isUserRoomCreator && (
          <ShareLinkContainer>
            <LinkInput 
              value={roomLink} 
              readOnly 
              onClick={(e) => e.target.select()}
            />
            <Tooltip title="Copy link">
              <IconButton 
                size="small" 
                onClick={handleCopyLink}
                sx={{ color: theme.palette.common.white }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton 
                size="small" 
                onClick={() => setShowShareLink(false)}
                sx={{ color: theme.palette.common.white, ml: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ShareLinkContainer>
        )}
      </Box>
      
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <ControlsContainer>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RoomButtons />
            {isUserRoomCreator && (
              <Tooltip title="Share room link">
                <ShareButton onClick={handleShareClick}>
                  <ShareIcon />
                </ShareButton>
              </Tooltip>
            )}
          </Box>
          <ResizeRoomButton
            isRoomMinimized={isRoomMinimized}
            handleRoomResize={roomResizeHandler}
          />
        </ControlsContainer>
      </Slide>

      {/* Success notification */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showCopiedAlert}
        autoHideDuration={2000}
        onClose={() => setShowCopiedAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default Room;