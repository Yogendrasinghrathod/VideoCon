import React from "react";
import { styled } from "@mui/system";
import AddFriendButton from "./AddFriendButton";
import FriendsTitle from "./FriendsTitle";
import FriendsList from "./FriendsList/FriendsList";
import PendingInvitationsList from "./PendingInvitationsList/PendingInvitationsList";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const MainContainer = styled("div")(({ theme }) => ({
  width: "224px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: theme.palette.secondary.main,
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `inset -1px 0 0 ${alpha(theme.palette.common.white, 0.05)}`,
}));

const FriendsSideBar = () => {
  const theme = useTheme();
  return (
    <MainContainer theme={theme}>
      <AddFriendButton />
      <FriendsTitle title="Private Messages" />
      <FriendsList />
      <FriendsTitle title="Invitations" />
      <PendingInvitationsList />
    </MainContainer>
  );
};

export default FriendsSideBar;
