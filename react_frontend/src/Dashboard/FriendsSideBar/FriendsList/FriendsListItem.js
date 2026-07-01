import React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Avatar from "../../../shared/components/Avatar";
import Typography from "@mui/material/Typography";
import OnlineIndicator from "./OnlineIndicator";
import { setChosenChatDetails, chatTypes } from "../../../store/actions/chatActions";
import * as roomHandler from "../../../realtimeCommunication/roomHandler";
import CallIcon from "@mui/icons-material/Call";

const FriendsListItem = ({ id, username, isOnline }) => {
  const dispatch = useDispatch();

  const handleChooseActiveConversation = () => {
    dispatch(setChosenChatDetails({ id: id, name: username }, chatTypes.DIRECT));
  };

  const handleCallFriend = (e) => {
    e.stopPropagation();
    roomHandler.createNewRoomWithTarget(id);
  };

  return (
    <Button
      onClick={handleChooseActiveConversation}
      style={{
        width: "100%",
        height: "42px",
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        textTransform: "none",
        color: "black",
        position: "relative",
      }}
    >
      <Avatar username={username} />
      <Typography
        style={{
          marginLeft: "7px",
          fontWeight: 700,
          color: "#8e9297",
        }}
        variant="subtitle1"
        align="left"
      >
        {username}
      </Typography>
      {isOnline && <OnlineIndicator />}
      <Button
        onClick={handleCallFriend}
        disabled={!isOnline}
        style={{
          marginLeft: "auto",
          minWidth: "32px",
          height: "32px",
          borderRadius: "50%",
          padding: 0,
          backgroundColor: isOnline ? "#5865F2" : "#4e5660",
        }}
      >
        <CallIcon style={{ fontSize: 16, color: "white" }} />
      </Button>
    </Button>
  );
};

export default FriendsListItem;
