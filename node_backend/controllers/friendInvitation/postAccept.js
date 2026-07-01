const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the invitation
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(401).send("Error occurred. Invitation not found.");
    }

    const { senderId, receiverId } = invitation;

    // Check if they are already friends
    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(receiverId);

    if (senderUser.friends.includes(receiverId) || receiverUser.friends.includes(senderId)) {
      return res.status(400).send("You are already friends.");
    }

    // Add friends to both users' friend lists
    senderUser.friends.push(receiverId);
    receiverUser.friends.push(senderId);

    await senderUser.save();
    await receiverUser.save();

    // Delete the invitation
    await FriendInvitation.findByIdAndDelete(id);

    // Update friends list for both sender and receiver
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    // Update pending invitations for the receiver
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send("Friend successfully added.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again.");
  }
};

module.exports = postAccept;
