const asyncHandler = require("express-async-handler");
const User = require("../models/Users/User");

const isAccountVerified = asyncHandler(async (req, res, next) => {
  //Get the user id from userAuth
  const currentID = req.userAuth._id;

  const currentUser = User.findById(currentID);
  if (!currentUser) {
    const error = new Error("User not found!");
    next(error);
    return;
  }
  //Check user verified or not
  if (currentUser.isVerified) {
    next();
  } else {
    res
      .status(401)
      .json({ status: "Failed", message: "Sorry! Account not Verified " });
  }
});

module.exports = isAccountVerified;
