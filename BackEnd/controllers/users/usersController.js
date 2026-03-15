//@desc Register new user
//@route POST/api/v1/users/register
//@access public
const User = require("../../models/Users/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/genereteToken");
const asyncHandler = require("express-async-handler");
const sendPasswordResetEmail = require("../../utils/sendPasswordResetEmail");
const crypto = require("crypto");
const sendAccountVerificationEmail = require("../../utils/sendAccountVerificationEmail");
const Post = require("../../models/Posts/Post");

//@desc Register new user
//@route POST/api/v1/users/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const profilePicture = req.file?.path || "default-profile.jpg";
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("Username Already Exist!");
  }
  const newUser = new User({ username, email, password, profilePicture });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();
  res.json({
    status: "success",
    message: "Data Record save successfully.",
    _id: newUser?.id,
    userName: newUser?.username,
    eamil: newUser?.email,
    role: newUser?.role,
    profilePicture: newUser?.profilePicture,
  });
});

//@desc Update user
//@route POST/api/v1/users/profile-picture
//@access public
exports.profilePicture = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Ensure logged-in user matches the one being updated
  if (req?.userAuth?._id.toString() !== userId.toString()) {
    throw new Error("You are not authorized to update this profile picture.");
  }

  // Get the user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  // Update profile picture path (from multer)
  user.profilePicture = req.file?.path || user.profilePicture;

  //  Save changes
  await user.save();

  // Send response
  res.json({
    status: "success",
    message: "Profile picture updated successfully.",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    },
  });
});

//@desc Update Cover image
//@route POST/api/v1/users/cover-image
//@access public
exports.coverImage = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  //Ensure logged-in user matches the one being updated
  if (req.userAuth._id.toString() !== userId.toString()) {
    throw new Error("You are not authorized to update this cover picture.");
  }
  // Get the user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  //Update profile picture path (from multer)
  user.coverImage = req.file?.path || user.coverImage;

  // Save changes
  await user.save();

  // Send response
  res.json({
    status: "success",
    message: "Profile picture updated successfully.",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      coverImage: user.coverImage,
    },
  });
});

//@desc Login new user
//@route POST/api/v1/users/login
//@access public

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid Credential!");
  }

  const isMatched = await bcrypt.compare(password, user?.password);
  if (!isMatched) {
    throw new Error("Invalid Credential!");
  }

  user.lastlogin = new Date();
  await user.save();
  res.json({
    status: "success",
    Email: user?.email,
    Id: user?._id,
    user: user?.username,
    role: user?.role,
    profilePicture: user?.profilePicture,
    token: generateToken(user),
  });
});

//@desc profile
//@route GET/api/v1/users/profile/:id
//@access private

exports.getProfile = asyncHandler(async (req, res, next) => {
  const userData = await User.findById(req?.userAuth?._id)
    .populate({ path: "posts", model: Post })
    .populate({ path: "following", model: User })
    .populate({ path: "followers", model: User })
    .populate({ path: "blockedUsers", model: User })
    .populate({ path: "profileViewers", model: User });

  res.json({
    status: "success",
    message: "prodile Fetched",
    userdata: userData,
  });
});

//@desc public profile
//@route GET/api/v1/users/public-profile/:userId
//@access private

exports.getPublicProfile = asyncHandler(async (req, res, next) => {
  const userData = await User.findById(req?.params?.userId)
    .select("-password")
    .populate({ path: "posts", model: Post });

  res.json({
    status: "success",
    message: "Public profile Fetched successfully",
    userdata: userData,
  });
});

//@desc private profile
//@route GET/api/v1/users/private-profile/
//@access private

exports.getPrivateProfile = asyncHandler(async (req, res, next) => {
  const userData = await User.findById(req?.userAuth?._id).populate({
    path: "posts",
    model: Post,
  });

  res.json({
    status: "success",
    message: "Private profile Fetched successfully",
    userdata: userData,
  });
});

//@Desc Block user
//@route PUT api/v1/users/block/useridBlock
//@Access private

exports.blockUser = asyncHandler(async (req, res, next) => {
  //Find the user id to be blocked
  const userID = req.params.id;

  //Check weather the user is present int the DB or not
  const userToBeBlock = await User.findById(userID);
  if (!userToBeBlock) {
    const error = new Error("User to block not fount!");
    next(error);
  }

  //GET the current user id
  const blockingUserId = req?.userAuth?._id;

  //Check if it is self Blocking
  if (blockingUserId.toString() === userID.toString()) {
    const error = new Error("Cann't block Yourself!");
    next(error);
    return;
  }
  const currentUser = await User.findById(blockingUserId);

  //Check weather the useidtoblock is already blocked
  if (currentUser.blockedUsers.includes(userID)) {
    const error = new Error("User has been Already blocked!");
    next(error);
    return;
  }
  //Push the user to be block in the blockedKUser array
  currentUser.blockedUsers.push(userID);
  await currentUser.save();

  res
    .status(201)
    .json({ status: "success", message: "User Block successfully!" });
});

//@Desc unblocking user
//@ router PUT /api/v1/users/unblock/:id
//Access Private

exports.unBlockUser = asyncHandler(async (req, res, next) => {
  //GET block user id
  const userID = req.params.id;

  //Check weather the user is present int the DB or not
  const blockUser = await User.findById(userID);
  if (!blockUser) {
    const error = new Error("User doesn't found in the user DB");
    next(error);
    return;
  }
  //GET the current user id
  const currentUserID = req?.userAuth?._id;
  const currentUser = await User.findById(currentUserID);

  //Check if the user to unnlock to alrady block
  if (!currentUser.blockedUsers.includes(userID)) {
    const error = new Error("User Already Unblocked.");
    next(error);
    return;
  }
  //Remove the user from the current user blockedUsers ARRAY
  currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => {
    return id.toString() !== userID;
  });
  //update the DB
  await currentUser.save();
  res
    .status(201)
    .json({ status: "success", message: "User unBlock successfully!" });
});

//@Desc OtherViewers
//@Router GET api/v1/users/view-other-profile/:id
//@Access private

exports.viewOtherProfile = asyncHandler(async (req, res, next) => {
  //GET user id whose profile to be viewed
  const userID = req.params.id;
  const userProfile = await User.findById(userID);
  if (!userProfile) {
    const error = new Error("User whose profile is to be viewed not present");
    next(error);
    return;
  }
  //GET current user
  const currentID = req?.userAuth?._id;
  const currentUserProfile = await User.findById(currentID);
  //Check if we have already viewed the profile of userprofile
  if (userProfile.profileVieweres.includes(currentID)) {
    const error = new Error("You have already viewed the user profile");
    next(error);
    return;
  }
  //Push the usrID into the array of Current userprofile
  userProfile.profileVieweres.push(currentID);

  //Update the DB
  await userProfile.save();
  res
    .status(201)
    .json({ status: "success", message: "User profile viewed successfully!" });
});

//@Desc Follow user
//@Router PUT api/v1/users/following/:id
//@Access private

exports.followingUser = asyncHandler(async (req, res, next) => {
  //GET currennt usr id
  const currentID = req?.userAuth?._id;
  const currentProfile = await User.findById(currentID);

  //GET the to be folling user id
  const userID = req.params.id;
  const userProfile = await User.findById(userID);
  if (!userProfile) {
    const error = new Error("User whose profile is to be followed not present");
    next(error);
    return;
  }
  //Avoid current user following himself
  if (currentID.toString() === userID.toString()) {
    const error = new Error("You Can't Follow yourself");
    next(error);
    return;
  }
  //push the id to of userTofollow inside following array of the current user
  const followingUserID = await User.findByIdAndUpdate(
    currentID,
    { $addToSet: { following: userID } },
    { new: true }
  );
  if (!followingUserID) {
    const error = new Error("You following Already to the user !");
    next(error);
    return;
  }

  //push the current user id into to the followers array of the userToFollow
  const followerUserID = await User.findByIdAndUpdate(
    userID,
    { $addToSet: { followers: currentID } },
    { new: true }
  );
  if (!followerUserID) {
    const error = new Error("You following Already to the user !");
    next(error);
    return;
  }

  //send the response
  res
    .status(201)
    .json({ status: "success", message: "Follwing successfully done." });
});

//@Desc unFollow user
//@Router PUT api/v1/users/unfollowing/:id
//@Access private

exports.unFollowUser = asyncHandler(async (req, res, next) => {
  //GET the userID
  const userID = req?.params?.id;
  console.log(userID);
  const userProfile = await User.findById(userID);

  //check weather user exist or not
  if (!userProfile) {
    const error = new Error(
      "User whose profile is to be unfollowed not present"
    );
    next(error);
    return;
  }

  //GET the current user
  const currentID = req?.userAuth?._id;
  const currentUser = await User.findById(currentID);

  //Check user to be unfollow yourself
  if (currentID.toString() === userID.toString()) {
    const error = new Error(
      "This is your userID so, You con't unfollow yourself"
    );
    next(error);
    return;
  }

  //Check weather the current user has follow userid or not
  console.log(currentUser.following);
  if (!currentUser.following.includes(userID)) {
    const error = new Error("Yor don't have followed the user.");
    next(error);
    return;
  }

  //Remove the useid from the following list and update the following array
  await User.findByIdAndUpdate(
    currentID,
    { $pull: { following: userID } },
    { new: true }
  );

  //Remove the currentID from the Followers array and update the follower array
  await User.findByIdAndUpdate(
    userID,
    { $pull: { followers: currentID } },
    { new: true }
  );

  // Send the response
  res
    .status(201)
    .json({ status: "success", message: "Unfollow successfully done." });
});

//@Desc Password forgot
//@Route POST  api/users/forgot-password/:emailID
//@Access Public route

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //GET the emilID
  const { email } = req?.body
  console.log(email);

  //Find emailID in the DB
  const userFound = await User.findOne({ email });
  if (!userFound) {
    const error = new Error("This email is not registered with US");
    next(error);
    return;
  }
  //Get the reset Token
  const resetToken = await userFound.generatePasswordResetToken();

  //Save the changes (resetToken and expiryTime to the DB)
  await userFound.save();
  sendPasswordResetEmail(email, resetToken);

  //Send the response
  res.status(201).json({
    status: "success",
    message: "Password reset token sent to your email successfully.",
  });
});

//@Desc Reset Password
//@Route POST or PUT  api/users/reset-password/:reset-token
//@Access Public route

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //GET the resetToken
  const { resetToken } = req.params;
  //GET the password
  const { password } = req.body;

  //Convert resetToken into hashToken
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Verigy the token with DB
  const userFound = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //if user is not found
  if (!userFound) {
    let error = new Error("Password reset token is invalid or expired");
    next(error);
    return;
  }
  //Update the new password
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);

  //Remove passwordResetToken and passwordResetExpires
  userFound.passwordResetToken = undefined;
  userFound.passwordResetExpires = undefined;

  //Resave the user
  await userFound.save();

  //Send the response
  res
    .status(201)
    .json({ status: "success", message: "Password Reset successfully" });
});

//@Desc send Account verifiction email
//Route PUT api/v1/users/account-verification-email
//ACcess Private

exports.accountVerificationEmail = asyncHandler(async (req, res, next) => {
  //Get the Email id of the current user
  const currentUser = await User.findById(req?.userAuth?._id);
  if (!currentUser) {
    const error = new Error("User not found !");
    next(error);
    return;
  }
  //Get the veifiction token from user model
  const verificationToken =
    await currentUser.generateAccountVerificationToken();

  //Resave the user
  await currentUser.save();

  //Send the verification email
  await sendAccountVerificationEmail(currentUser.email, verificationToken);
  //send the response
  res.json({
    status: "success",
    message: `Account verification email send successfully, to your registered emailID  . ${verificationToken}`,
  });
});

//@Desc  Account verify
//Route PUT api/v1/users/account-verify/:verifyToken
//ACcess Private

exports.verifyAccount = asyncHandler(async (req, res, next) => {
  //Get the verify token from params
  const { verifyToken } = req.params;

  //Convert the token into hashed form
  const cryptoToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });
  //Check userFound or not
  if (!userFound) {
    const error = new Error("Account verification failed!");
    next(error);
    return;
  }
  //update the user
  userFound.isVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationExpires = undefined;

  await userFound.save();

  //Send the response
  res.json({
    status: "success",
    message: "Account verified successfully Done.",
  });
});
