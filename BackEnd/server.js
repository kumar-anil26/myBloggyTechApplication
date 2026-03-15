const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const usersRouter = require("./routers/users/usersRouter");
const connectDB = require("./config/database");
const {
  notFound,
  globalErrorHandler,
} = require("./middlewares/globalErrorHandler");
const categoriesRouter = require("./routers/category/CategoriesRouter");
const postsRouter = require("./routers/post/PostsRouter");
const commentsRouter = require("./routers/comments/commentsRouter");

//! Create an express app
const app = express();

//!Load the enviroment variable
dotenv.config();

//!Established connection to MondoDB
connectDB();

//!Set up the middleware
app.use(express.json());
app.use(cors());

//? Setup the router
const PORT = process.env.PORT || 9080;

//?Setup the user router
app.use("/api/v1/users", usersRouter);

//?SetUp the Category Router
app.use("/api/v1/categories", categoriesRouter);

//?SetUp the Post router
app.use("/api/v1/posts", postsRouter);

//?SetUP the Comments Router
app.use("/api/v1/comments", commentsRouter);

//!Not Found Error middleware (handler)
app.use(notFound);

//!Global error handling
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});

module.exports = app