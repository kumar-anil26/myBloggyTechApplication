const asyncHandler = require("express-async-handler");
const Post = require("../../models/Posts/Post");
const User = require("../../models/Users/User");
const Category = require("../../models/Categories/Categories");
const { post } = require("../../routers/users/usersRouter");

//@ Posts Creation
//@ POST api/vi/posts
//@ Private Route

exports.createPost = asyncHandler(async (req, res, next) => {
  //Get the payload
  const { title, content, categoryID } = req.body;

  //Check if the Post present
  const postFound = await Post.findOne({ title });
  if (postFound) {
    let error = new Error("Post Already Existing.");
    next(error);
    return;
  }
  //Create post object
  const post = await Post.create({
    title,
    content,
    category: categoryID,
    author: req?.userAuth?._id,
    image: req.file.path,
  });

  //Update user by adding post in it
  const userInfo = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    { $push: { posts: post?._id } },
    { new: true }
  );

  //update category by adding post in it
  const categoryInfo = await Category.findByIdAndUpdate(
    categoryID,
    { $push: { post: post?._id } },
    { new: true }
  );

  //send the response
  res.status(201).json({
    status: "Success",
    message: "Post successfully created",
    post,
    userInfo,
    categoryInfo,
  });
});

//@Desc GetAllposts
//@GET api/v1/posts
//@public route

exports.getAllPosts = asyncHandler(async (req, res) => {
  //Get the current user id
  const currentID = req.userAuth._id;

  //Get all those users who have blocked the current user
  const usersBlockingCurrentUser = await User.find({ blockedUsers: currentID });

  //Extract the id of the users who have blocked the current user
  const blockingUsersIds = usersBlockingCurrentUser.map(
    (userObj) => userObj._id
  );

  //Fetch those posts whose author is not present in the blockingUserId
  const currentDateTime = new Date();
  const query = {
    author: { $nin: blockingUsersIds },
    $or: [
      {
        scheduledPublished: { $lte: currentDateTime },
        scheduledPublished: null,
      },
    ],
  };
  const allPosts = await Post.find(query)
    .populate({
      path: "author",
      model: User,
      select: "username email role",
    })
    .populate({
      path: "category",
      model: Category,
    });

  //send the Response
  res.status(201).json({
    status: "Success",
    message: "All Post Fetched Successfully.",
    allPosts,
  });
});

//@Desc Get single post
//@GET api/v1/posts/:id
//@public route

exports.getAPosts = asyncHandler(async (req, res, next) => {
  //Fetch post ID
  const postID = req?.params?.id;

  //Fetch a post from the post db
  const post = await Post.findById(postID)
    .populate("author")
    .populate("category")
    .populate({
      path: "comments",
      model: "Comment",
      populate: { path: "author", model: "User" },
    });

  //Check if post exists
  if (!post) {
    const error = new Error("Post not found");
    next(error);
    return;
  }

  //send the Response
  res.status(200).json({
    status: "Success",
    message: "Post Fetched Successfully.",
    post,
  });
});

//@Desc Get only 4  posts
//@GET api/v1/posts/public-posts
//@public route

exports.getPublicPosts = asyncHandler(async (req, res) => {
  //Fetch a four posts from the post db
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("category");

  //send the Response
  res.status(201).json({
    status: "Success",
    message: "Posts Fetched Successfully.",
    posts,
  });
});

//@Desc Delete post
//@DELETE /api/v1/post/:id
//@private route

exports.deletePost = asyncHandler(async (req, res, next) => {
  //fetch postID
  const postID = req.params.id;

  //Fetch Post object from the DB
  const post = await Post.findById(postID);
  const isAuthor =
    req?.userAuth?._id.toString() === post?.author?._id.toString();

  //Check both user and author are same or not
  if (!isAuthor) {
    let error = new Error(
      "Action Denied!, your are not the creater of this post "
    );
    next(error);
    return error;
  }
  //Fetch post
  const deletedPost = await Post.findByIdAndDelete(postID);
  //Send Response
  res.status(201).json({
    status: "Success",
    message: "Post successfully deleted.",
    deletedPost,
  });
});

//@Update Post
//@PUT api/v1/posts/:id
//@ Private router

exports.updatePost = asyncHandler(async (req, res, next) => {
  //GET  post id
  const postID = req.params.id;
  const postFound = await Post.findById(postID);
  if (!postFound) {
    const error = new Error("Post not found!");
    next(error);
    return;
  }
  //GET post from the DB
  const { title, content, category } = req.body;
  const image = req?.file?.path;

  //updated post
  const updatePost = await Post.findByIdAndUpdate(
    postID,
    {
      title: title ? title : postFound?.title,
      content: content ? content : postFound?.content,
      image: image ? image : postFound?.image,
      category: category ? category : postFound?.category,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  //send the response
  res.status(201).json({
    status: "Success",
    message: "Post successfully updated",
    updatePost,
  });
});

//Desc like posts
//Router PUT /api/v1/post/like/:postID
//Access Private

exports.likePost = asyncHandler(async (req, res, next) => {
  //Get the post id
  const { postID } = req.params;
  //Get the current user id from userAuth
  const currentID = req?.userAuth?._id;
  //Get the user
  const post = await Post.findById(postID);
  if (!post) {
    const error = new Error("Post not found!");
    next(error);
    return;
  }
  //Add the current userid to like arrray
  const updatePost = await Post.findByIdAndUpdate(
    postID,
    { $addToSet: { likes: currentID } },
    { new: true }
  );
  //Remove the currenid from dislikes array
  post.disLikes = post.disLikes.filter((userId) => {
    return userId.toString() !== currentID.toString();
  });
  //Resave the post
  const updatedLikePost = await post.save();

  res.status(201).json({
    status: "Success",
    message: "post likes successfully!",
    post: updatedLikePost,
  });
});

//Desc DisLikes posts
//Router PUT /api/v1/post/dislike/:postID
//Access Private

exports.disLikesPost = asyncHandler(async (req, res, next) => {
  //Get the post id
  const { postID } = req.params;
  //Get the current user id from userAuth
  const currentID = req?.userAuth?._id;
  //Get the user
  const post = await Post.findById(postID);
  if (!post) {
    const error = new Error("Post not found!");
    next(error);
    return;
  }
  //Add the current userid to like arrray
  const updatePost = await Post.findByIdAndUpdate(
    postID,
    { $addToSet: { disLikes: currentID } },
    { new: true }
  );
  //Remove the currenid from likes array
  post.likes = post.likes.filter(
    (userId) => userId.toString() !== currentID.toString()
  );
  //Resave the post
  const updateddisLikePost = await post.save();

  res.status(201).json({
    status: "Success",
    message: "post disLikes successfully!",
    post: updateddisLikePost,
  });
});

//@Describe Clap
//@Route PUT api/v1/posts/claps/:postID
//@Access Private

exports.clapPost = asyncHandler(async (req, res, next) => {
  //Get post id from param
  const { postID } = req.params;

  //Get the post
  const post = Post.findById(postID);
  //Check post exist or not
  if (!post) {
    const error = new Error("Post not found!");
    next(error);
    return;
  }
  const updatedClapsPost = await Post.findByIdAndUpdate(
    postID,
    { $inc: { claps: 1 } },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    message: "Post claps successfully.",
    post: updatedClapsPost,
  });
});

//Desc Views posts
//Router PUT /api/v1/post/views/:postID
//Access Private

exports.viewsPost = asyncHandler(async (req, res, next) => {
  //Get the post id
  const { postID } = req.params;
  //Get the current user id from userAuth
  const currentID = req?.userAuth?._id;
  //Get the user
  const post = await Post.findById(postID);
  if (!post) {
    const error = new Error("Post not found!");
    next(error);
    return;
  }
  //Add the current userid to views arrray
  const updatedPost = await Post.findByIdAndUpdate(
    postID,
    { $addToSet: { postsViews: currentID } },
    { new: true }
  ).populate("author");

  res.status(201).json({
    status: "Success",
    message: "post views successfully!",
    post: updatedPost,
  });
});

//@Desc Schedule a post
//@Route  PUT api/v1/posts/schedule/:postID
//@Access private

exports.schedulePost = asyncHandler(async (req, res, next) => {
  //Get post id from params
  const { postID } = req?.params;

  //Get the Schedule time from body
  const { scheduledPublish } = req?.body;

  //Check if postID and SchedulePublish are present or not
  if (!postID || !scheduledPublish) {
    const error = new Error(
      "PostID and ScheduledPublish data both are required"
    );
    next(error);
    return;
  }
  //Find the post from DB
  const post = await Post.findById(postID);
  if (!post) {
    const error = new Error("Post not found!");
    next(error);
    return;
  }
  //Check if the current user is the author or not
  if (post.author.toString() !== req?.userAuth?._id.toString()) {
    const error = new Error("You can Schedule only your post.");
    next(error);
    return;
  }
  //Convert scheduledPublished string data into Date
  const scheduledDate = new Date(scheduledPublish);
  const currentDate = new Date();

  //Check date comparision
  if (scheduledDate < currentDate) {
    const error = new Error("Scheduled Date cann't be the previous Date.");
    next(error);
    return;
  }
  //Update the database
  post.scheduledPublished = scheduledDate;
  await post.save();
  res
    .status(201)
    .json({ status: "success", message: "Schedule Date is successfully set." });
});
