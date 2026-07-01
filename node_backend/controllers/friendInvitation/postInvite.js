const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { userId, mail } = req.user;

  try {
    // Check if friend that we would like to invite is not the user
    if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
      return res
        .status(409)
        .send("Sorry. You cannot become friends with yourself.");
    }

    // Find the target user by email
    const targetUser = await User.findOne({
      mail: targetMailAddress.toLowerCase(),
    });

    // If the user does not exist, return an error message
    if (!targetUser) {
      return res
        .status(404)
        .send(`Friend with email ${targetMailAddress} not found.`);
    }

    // Check if an invitation has already been sent
    const invitationAlreadyReceived = await FriendInvitation.findOne({
      senderId: userId,
      receiverId: targetUser._id,
    });

    if (invitationAlreadyReceived) {
      return res.status(409).send("Invitation has already been sent.");
    }

    // Check if the target user is already a friend
    const usersAlreadyFriends = targetUser.friends.some(
      (friendId) => friendId.toString() === userId.toString()
    );

    if (usersAlreadyFriends) {
      return res
        .status(409)
        .send("You are already friends. Please check your friends list.");
    }

    // Create new friend invitation
    const newInvitation = await FriendInvitation.create({
      senderId: userId,
      receiverId: targetUser._id,
    });

    // Update the friends pending invitations if the target user is online
    friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

    return res.status(201).send("Invitation has been sent.");
  } catch (err) {
    console.log("Error while sending invitation:", err);
    return res.status(500).send("Something went wrong. Please try again.");
  }
};

module.exports = postInvite;
