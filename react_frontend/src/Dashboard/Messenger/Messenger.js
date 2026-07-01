import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import WelcomeMessage from "./WelcomeMessage";
import MessengerContent from "./MessengerContent";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const MainContainer = styled("div")(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  marginTop: "48px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.divider, 0.1)}, transparent)`,
  },
}));

const LoadingIndicator = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  padding: "20px",
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: "8px",
  backdropFilter: "blur(10px)",
}));

const Messenger = () => {
  const theme = useTheme();
  const chosenChatDetails = useSelector(state => state.chat.chosenChatDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (replace with actual loading logic if necessary)
    if (!chosenChatDetails) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [chosenChatDetails]);

  return (
    <MainContainer theme={theme}>
      {loading ? (
        <LoadingIndicator theme={theme}>Loading chat...</LoadingIndicator>
      ) : !chosenChatDetails ? (
        <WelcomeMessage />
      ) : (
        <MessengerContent chosenChatDetails={chosenChatDetails} />
      )}
    </MainContainer>
  );
};

export default Messenger;
