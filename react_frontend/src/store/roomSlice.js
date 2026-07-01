import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomId: null,
  localStream: null,
  remoteStreams: [],
  screenSharingStream: null,
  isUserSharingScreen: false,
  incomingCall: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.roomId = action.payload;
      state.isUserInRoom = true;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStreams: (state, action) => {
      state.remoteStreams = action.payload;
    },
    setScreenSharingStream: (state, action) => {
      state.screenSharingStream = action.payload;
      state.isUserSharingScreen = !!action.payload;
    },
    setIsUserRoomCreator: (state, action) => {
      state.isUserRoomCreator = action.payload;
    },
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    resetRoomState: () => initialState,
  },
});

export const {
  setRoomId,
  setLocalStream,
  setRemoteStreams,
  setScreenSharingStream,
  setIsUserRoomCreator,
  setIncomingCall,
  clearIncomingCall,
  resetRoomState,
} = roomSlice.actions;

export default roomSlice.reducer; 