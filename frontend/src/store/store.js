import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../redux/slices/users/userSlices";
import postsReducer from "../redux/slices/posts/postSlices";
import categoriesReducer from "../redux/slices/categories/CategorySlices";
import commentsReducer from "../redux/slices/comments/commentsSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    categories: categoriesReducer,
    comments: commentsReducer,
  },
});

export default store;
