const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postReject = async (req, res) => {
  const { id } = req.body;
  const { userId } = req.user;

  try {
    // Check if the invitation exists
    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(404).send("Invitation not found.");
    }

    // If the invitation exists, make sure it was intended for the current user
    if (invitation.receiverId.toString() !== userId.toString()) {
      return res.status(403).send("You are not authorized to reject this invitation.");
    }

    // Remove the invitation from the FriendInvitation collection
    await FriendInvitation.findByIdAndDelete(id);

    // Update the pending invitations for the user
    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send("Invitation successfully rejected.");
  } catch (err) {
    console.log("Error rejecting invitation:", err);
    return res.status(500).send("Something went wrong. Please try again.");
  }
};

module.exports = postReject;
