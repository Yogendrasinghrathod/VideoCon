import React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Box, Divider, Tooltip, IconButton, alpha } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../shared/utils/auth.js';
import MainPageButton from "./MainPageButton";
import CreateRoomButton from "./CreateRoomButton";
import ActiveRoomButton from "./ActiveRoomButton";

// Enhanced sidebar container with subtle gradient and smoother styling
const MainContainer = ({ theme, children }) => (
  <Box
    sx={{
      width: "72px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: `linear-gradient(180deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
      padding: theme.spacing(2, 0, 1),
      gap: theme.spacing(2),
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      boxShadow: `inset -1px 0 0 ${alpha(theme.palette.common.white, 0.05)}`,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
      },
    }}
  >
    {children}
  </Box>
);

// Improved scrollable container for active rooms
const RoomsContainer = ({ theme, children }) => (
  <Box
    sx={{
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
      px: 0.5,
      mt: 1,
      "&::-webkit-scrollbar": { 
        width: "4px" 
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: alpha(theme.palette.common.white, 0.1),
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
        marginTop: "4px",
        marginBottom: "4px",
      },
      "& > *": {
        my: 0.5, // Add spacing between room buttons
      },
    }}
  >
    {children}
  </Box>
);

// Enhanced bottom container with better spacing
const BottomContainer = ({ theme, children }) => (
  <Box
    sx={{
      mt: "auto",
      pt: 1,
      pb: 1.5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      background: alpha(theme.palette.background.default, 0.05),
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    }}
  >
    {children}
  </Box>
);

// Button wrapper with hover effect
const ButtonWrapper = ({ children }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
      },
    }}
  >
    {children}
  </Box>
);

const SideBar = () => {
  const theme = useTheme();
  const { activeRooms, isUserInRoom } = useSelector((state) => state.room);

  const handleLogout = () => {
    logout();
  };

  return (
    <MainContainer theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%", alignItems: "center" }}>
        <Tooltip title="Main Page" placement="right" arrow>
          <ButtonWrapper>
            <MainPageButton />
          </ButtonWrapper>
        </Tooltip>

        <Tooltip title="Create Room" placement="right" arrow>
          <ButtonWrapper>
            <CreateRoomButton isUserInRoom={isUserInRoom} />
          </ButtonWrapper>
        </Tooltip>
      </Box>

      {activeRooms.length > 0 && (
        <>
          <Divider 
            sx={{ 
              width: "50%", 
              my: 1,
              borderColor: alpha(theme.palette.divider, 0.6),
              "&::before, &::after": {
                borderColor: alpha(theme.palette.divider, 0.6),
              },
            }} 
          />
          <RoomsContainer theme={theme}>
            {activeRooms.map((room) => (
              <Tooltip
                title={`${room.creatorUsername}'s Room (${room.participants.length} participants)`}
                placement="right"
                arrow
                key={room.roomId}
              >
                <ButtonWrapper>
                  <ActiveRoomButton
                    roomId={room.roomId}
                    creatorUsername={room.creatorUsername}
                    amountOfParticipants={room.participants.length}
                    isUserInRoom={isUserInRoom}
                  />
                </ButtonWrapper>
              </Tooltip>
            ))}
          </RoomsContainer>
        </>
      )}

      <BottomContainer theme={theme}>
        <Tooltip title="Logout" placement="right" arrow>
          <IconButton
            onClick={handleLogout}
            sx={{
              color: alpha(theme.palette.error.light, 0.9),
              transition: "all 0.2s ease",
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.dark, 0.2),
                color: theme.palette.error.light,
                transform: "scale(1.1)",
              },
              '&:active': {
                transform: "scale(0.95)",
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </BottomContainer>
    </MainContainer>
  );
};

export default SideBar;