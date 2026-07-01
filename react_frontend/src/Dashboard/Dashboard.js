import React, { useEffect } from "react";
import { styled } from "@mui/system";
import SideBar from "./SideBar/SideBar";
import FriendsSideBar from "./FriendsSideBar/FriendsSideBar";
import Messenger from "./Messenger/Messenger";
import AppBar from "./AppBar/AppBar";
import { logout } from "../shared/utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/actions/authActions";
import { connectWithSocketServer } from "../realtimeCommunication/socketConnection";
import Room from "./Room/Room";
import IncomingCallNotification from "./IncomingCallNotification/IncomingCallNotification";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5865F2', // Discord-like blue
      light: '#7983F5',
      dark: '#3B4AEF',
    },
    secondary: {
      main: '#2F3136', // Dark gray
      light: '#36393F',
      dark: '#202225',
    },
    background: {
      default: '#36393F',
      paper: '#2F3136',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B9BBBE',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
        },
      },
    },
  },
});

const DashboardWrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: '#f5f5f5',
});

const MainContent = styled("div")({
  display: "flex",
  flex: 1,
  overflow: "hidden",
  position: "relative",
});

const SideBarContainer = styled("div")({
  width: "72px",
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
});

const FriendsSideBarContainer = styled("div")({
  width: "240px",
  height: "100%",
  backgroundColor: "white",
  borderRight: "1px solid #e0e0e0",
  overflowY: "auto",
});

const MessengerContainer = styled("div")({
  flex: 1,
  height: "100%",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

const RoomOverlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Dashboard = () => {
  const room = useSelector((state) => state.room);
  const { isUserInRoom } = room;

  const dispatch = useDispatch();

  useEffect(() => {
    const userDetails = localStorage.getItem("user");

    if (!userDetails) {
      logout();
    } else {
      dispatch(setUserDetails(JSON.parse(userDetails)));
      connectWithSocketServer(JSON.parse(userDetails));
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <DashboardWrapper>
        <AppBar />
        <MainContent>
          <SideBarContainer>
            <SideBar />
          </SideBarContainer>
          <FriendsSideBarContainer>
            <FriendsSideBar />
          </FriendsSideBarContainer>
          <MessengerContainer>
            <Messenger />
          </MessengerContainer>
          {isUserInRoom && (
            <RoomOverlay>
              <Room />
            </RoomOverlay>
          )}
        </MainContent>
        <IncomingCallNotification />
      </DashboardWrapper>
    </ThemeProvider>
  );
};

export default Dashboard; 