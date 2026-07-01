import io from "socket.io-client";
import {
  setPendingFriendsInvitations,
  setFriends,
  setOnlineUsers,
} from "../store/actions/friendsActions";
import { setIncomingCall } from "../store/roomSlice";
import store from "../store/store";
import { updateDirectChatHistoryIfActive } from "../shared/utils/chat";
import * as roomHandler from "./roomHandler";
import * as webRTCHandler from "./webRTCHandler";
import { getActions } from "../store/actions/alertActions";

let socket = null;

export const connectWithSocketServer = (userDetails) => {
  const jwtToken = userDetails.token;
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

  socket = io(SOCKET_URL, {
    auth: {
      token: jwtToken,
    },
  });

  socket.on("connect", () => {
    console.log("succesfully connected with socket.io server");
    console.log(socket.id);
    
    // Notify server about user connection
    socket.emit("user-connect", {
      userId: userDetails._id,
    });
  });

  socket.on("friends-invitations", (data) => {
    const { pendingInvitations } = data;
    store.dispatch(setPendingFriendsInvitations(pendingInvitations));
  });

  socket.on("friends-list", (data) => {
    const { friends } = data;
    store.dispatch(setFriends(friends));
  });

  socket.on("online-users", (data) => {
    const { onlineUsers } = data;
    store.dispatch(setOnlineUsers(onlineUsers));
  });

  socket.on("direct-chat-history", (data) => {
    console.log(data);
    updateDirectChatHistoryIfActive(data);
  });

  socket.on("room-create", (data) => {
    roomHandler.newRoomCreated(data);
  });

  socket.on("active-rooms", (data) => {
    roomHandler.updateActiveRooms(data);
  });

  socket.on("conn-prepare", (data) => {
    console.log("conn-prepare called in socket connection", data);
    const { connUserSocketId } = data;
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, false);
    socket.emit("conn-init", { connUserSocketId: connUserSocketId });
  });

  socket.on("conn-init", (data) => {
    console.log("conn-init called in socket connection ", data);
    const { connUserSocketId } = data;
    webRTCHandler.prepareNewPeerConnection(connUserSocketId, true);
  });

  socket.on("conn-signal", (data) => {
    webRTCHandler.handleSignalingData(data);
  });

  socket.on("room-participant-left", (data) => {
    console.log("user left room");
    webRTCHandler.handleParticipantLeftRoom(data);
  });

  socket.on("force-disconnect", (data) => {
    const { reason } = data;
    const actions = getActions(store.dispatch);
    actions.openAlertMessage({
      alertType: "error",
      alertMessage: reason,
    });
    // Redirect to login or handle the disconnect
    window.location.href = "/login";
  });

  socket.on("incoming-call", (data) => {
    const { callerId, callerUsername, roomId } = data;
    // Store incoming call details
    store.dispatch(setIncomingCall({
      callerId,
      callerUsername,
      roomId,
    }));
  });

  return socket;
};

export const sendDirectMessage = (data) => {
  console.log(data);
  socket.emit("direct-message", data);
};

export const getDirectChatHistory = (data) => {
  socket.emit("direct-chat-history", data);
};

export const createNewRoom = () => {
  socket.emit("room-create");
};

export const createNewRoomWithTarget = (targetUserId) => {
  socket.emit("room-create-with-target", { targetUserId });
};

export const joinRoom = (data) => {
  socket.emit("room-join", data);
};

export const leaveRoom = (data) => {
  socket.emit("room-leave", data);
};

export const signalPeerData = (data) => {
  console.log("signal-peer-data called in socketConnection");
  socket.emit("conn-signal", data);
};
