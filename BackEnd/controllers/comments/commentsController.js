const asyncHandler = require("express-async-handler");
const Post = require("../../models/Posts/Post");
const Comment = require("../../models/Comments/Comment");

//@Describe new Comments
//@route POST api/v1/comment/:postID
//@Access private

exports.createComment = asyncHandler(async (req, res, next) => {
  //GET the post id
  const postID = req.params.id;

  //GET the payload
  const { message } = req.body;

  //Create Comment
  const comment = await Comment.create({
    message,
    author: req?.userAuth?._id,
    postId: postID,
  });
  //Associate comment with post

  const post = await Post.findByIdAndUpdate(
    postID,
    { $push: { comments: comment?._id } },
    { new: true }
  );

  //Send Response
  res.status(201).json({
    status: "Success",
    message: "Comment created successfylly!",
    comment,
  });
});

//@Describe Update comments
//@ router PUT /api/v1/comments/:id
//@access Private

exports.updateComment = asyncHandler(async (req, res, next) => {
  //GET the comment id
  const commentID = req.params.id;
  console.log(commentID);
  //GET the payload from the body
  const message = req.body.message;
  console.log(message);

  //Update the Comment

  const updatedComment = await Comment.findByIdAndUpdate(
    commentID,
    { message },
    { new: true, runValidators: true }
  );

  //Send the response
  res.status(201).json({
    status: "success",
    message: "Comments updated successflly!",
  });
});

//@Describe Delete comments
//@ router DELETE /api/v1/comments/:id
//@access Private

exports.deleteComments = asyncHandler(async (req, res) => {
  //GET comments id
  const commentID = req.params.id;

  await Comment.findByIdAndDelete(commentID);

  //Send response
  res
    .status(201)
    .json({ status: "Success", message: "Comment deleted successfully." });
});
