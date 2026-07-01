const postInvite = require("./postInvite");
const postAccept = require("./postAccept");
const postReject = require("./postReject");

exports.controllers = {
  // Handles sending friend invitations
  postInvite,

  // Handles accepting friend invitations
  postAccept,

  // Handles rejecting friend invitations
  postReject,
};
