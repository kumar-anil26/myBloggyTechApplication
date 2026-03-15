const express = require("express");
const multer = require("multer");
const storage = require("../../utils/fileUpload");
const {
  createPost,
  getAllPosts,
  getAPosts,
  deletePost,
  updatePost,
  likePost,
  disLikesPost,
  clapPost,
  schedulePost,
  getPublicPosts,
  viewsPost,
} = require("../../controllers/posts/postsController");
const { isLoggedIn } = require("../../middlewares/isLoggedIn");
const isAccountVerified = require("../../middlewares/isAccountVerified");

//!Create post route
const postsRouter = express.Router();

const upload = multer({ storage });
//!Upload Create post on the cloudinary Router
postsRouter.post("/", isLoggedIn, upload.single("file"), createPost);

// //!Create post router
// postsRouter.post("/", isLoggedIn, isAccountVerified, createPost);

//!Get All post router
postsRouter.get("/", isLoggedIn, getAllPosts);

//!Get public posts router
postsRouter.get("/public", getPublicPosts);

//!Get a  posts router
postsRouter.get("/:id", getAPosts);

//!Delete post router
postsRouter.delete("/:id", isLoggedIn, deletePost);

//!Update post router
postsRouter.put("/:id", isLoggedIn, upload.single("file"), updatePost);

//!Like Post route
postsRouter.put("/like/:postID", isLoggedIn, likePost);

//!DisLike Post route
postsRouter.put("/dislike/:postID", isLoggedIn, disLikesPost);

//!Claps a Post route
postsRouter.put("/claps/:postID", isLoggedIn, clapPost);

//!postViews route
postsRouter.put("/views/:postID", isLoggedIn, viewsPost);

//!Schedule a Post route
postsRouter.put("/schedule/:postID", isLoggedIn, schedulePost);

module.exports = postsRouter;
