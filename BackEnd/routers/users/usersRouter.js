const express = require("express");
const multer = require("multer");
const storage = require("../../utils/fileUpload");
const {
  register,
  login,
  getProfile,
  blockUser,
  unBlockUser,
  viewOtherProfile,
  followingUser,
  unFollowUser,
  forgotPassword,
  resetPassword,
  accountVerificationEmail,
  verifyAccount,
  getPublicProfile,
  profilePicture,
  coverImage,
  getPrivateProfile,
} = require("../../controllers/users/usersController");

const { isLoggedIn } = require("../../middlewares/isLoggedIn");

const usersRouter = express.Router();

const upload = multer({ storage });

//!Register Route
usersRouter.post("/register", register);

//!Login Route
usersRouter.post("/login", login);

//!Upload profile picture route
usersRouter.post(
  "/profile-picture/:userId",
  isLoggedIn,
  upload.single("file"),
  profilePicture
);
//!Upload cover image route
usersRouter.post(
  "/cover-image/:userId",
  isLoggedIn,
  upload.single("file"),
  coverImage
);

//!Profile Router
usersRouter.get("/profile", isLoggedIn, getProfile);

//! Get public profile
usersRouter.get("/public-profile/:userId", isLoggedIn, getPublicProfile);

//! Get private profile
usersRouter.get("/private-profile", isLoggedIn, getPrivateProfile);

//!Block user route
usersRouter.put("/block/:id", isLoggedIn, blockUser);

//!Unblocking user route
usersRouter.put("/unblock/:id", isLoggedIn, unBlockUser);

//!Viewed user Route
usersRouter.get("/view-other-profile/:id", isLoggedIn, viewOtherProfile);

//!Following or Followers user route
usersRouter.put("/following/:id", isLoggedIn, followingUser);

//!UnFollow or unFollower user route
usersRouter.put("/unfollow/:id", isLoggedIn, unFollowUser);

//!Forgot Password Route
usersRouter.post("/forgot-password", forgotPassword);

//!Reset Password Route
usersRouter.put("/reset-password/:resetToken", resetPassword);

//!Account verificaton email route
usersRouter.put(
  "/account-verification-email/",
  isLoggedIn,
  accountVerificationEmail
);

//!Account verify
usersRouter.put("/account-verify/:verifyToken", isLoggedIn, verifyAccount);

module.exports = usersRouter;
