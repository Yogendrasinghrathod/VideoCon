// chatActions.js

export const chatTypes = {
  DIRECT: "DIRECT",  // Direct messaging chat type
  GROUP: "GROUP",    // Group chat type
};

export const chatActions = {
  SET_CHOSEN_CHAT_DETAILS: "CHAT.SET_CHOSEN_CHAT_DETAILS",
  SET_MESSAGES: "CHAT.SET_MESSAGES",
  SET_CHAT_TYPE: "CHAT.SET_CHAT_TYPE",  // Action for setting chat type
};

// Action to set chosen chat details (e.g., user, group, etc.)
export const setChosenChatDetails = (chatDetails, type) => {
  return {
    type: chatActions.SET_CHOSEN_CHAT_DETAILS,
    chatType: type,   // Add chat type along with chat details
    chatDetails,      // The details of the current chat (e.g., user, group)
  };
};

// Action to set (or append) messages in the active conversation
export const setMessages = (messages) => {
  return {
    type: chatActions.SET_MESSAGES,
    messages,         // List of messages to be added
  };
};

// Optionally, action to set the chat type if you want to handle that separately
export const setChatType = (chatType) => {
  return {
    type: chatActions.SET_CHAT_TYPE,
    chatType,         // Setting the current chat type (DIRECT or GROUP)
  };
};

// Get action creators for dispatching
export const getActions = (dispatch) => {
  return {
    setChosenChatDetails: (details, chatType) =>
      dispatch(setChosenChatDetails(details, chatType)),
    setMessages: (messages) => dispatch(setMessages(messages)),
    setChatType: (chatType) => dispatch(setChatType(chatType)), // Optional, to set chat type explicitly
  };
};
