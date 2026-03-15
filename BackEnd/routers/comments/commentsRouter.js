const express = require("express");
const {
  createComment,
  updateComment,
  deleteComments,
} = require("../../controllers/comments/commentsController");
const { isLoggedIn } = require("../../middlewares/isLoggedIn");

//!Crete Comments Router
const commentsRouter = express.Router();

commentsRouter.post("/:id", isLoggedIn, createComment);

commentsRouter.put("/:id", isLoggedIn, updateComment);

commentsRouter.delete("/:id", isLoggedIn, deleteComments);

module.exports = commentsRouter;
