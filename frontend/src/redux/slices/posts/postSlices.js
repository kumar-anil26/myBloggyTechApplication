import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import {
  resetErrorAction,
  resetSuccessAction,
} from "../globalSlices/GlobalSlice";

const INITIAL_STATE = {
  loading: false,
  error: null,
  success: null,
  posts: [],
  post: null,
};

//Fetch public get action
export const fetchPublicPostsAction = createAsyncThunk(
  "posts/fetch-public-posts",
  async (payload, { rejectWithValue }) => {
    //Make request
    try {
      const { data } = await axios.get(
        "https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/public"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Fetch all posts
export const PostsListAction = createAsyncThunk(
  "posts/fetch-posts-list",
  async (payload, { rejectWithValue, getState }) => {
    //Make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        "https://my-bloggy-tech-server-application.vercel.app/api/v1/posts",
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!Get single post

export const getPostAction = createAsyncThunk(
  "posts/post",
  async (payload, { rejectWithValue }) => {
    //Make request
    try {
      const { data } = await axios.get(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/${payload}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!Create a post action

export const createPostAction = createAsyncThunk(
  "posts/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      //Make request

      //Convert payload to formData

      const formData = new FormData(); // Fix: FormData was incorrectly capitalized
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("categoryID", payload.category);
      formData.append("file", payload.image);

      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "https://my-bloggy-tech-server-application.vercel.app/api/v1/posts",
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!Update Post
export const updatePostAction = createAsyncThunk(
  "posts/post-update",
  async (payload, { rejectWithValue, getState }) => {
    try {
      //Make request
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/${payload.id}`,
        payload.formData,
        config
      );
      return data;
    } catch (errro) {
      return rejectWithValue(errro?.response?.data);
    }
  }
);

//! Delete post

export const deletePostAction = createAsyncThunk(
  "posts/post-delete",
  async (payload, { rejectWithValue, getState }) => {
    try {
      //Make request
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/${payload}`,
        config
      );
      return data;
    } catch (errro) {
      return rejectWithValue(errro?.response?.data);
    }
  }
);

//!Likes post

export const likesPostAction = createAsyncThunk(
  "posts/likes",
  async (payload, { rejectWithValue, getState }) => {
    //Make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/like/${payload}`,
        {},
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!DisLikes post

export const disLikesPostAction = createAsyncThunk(
  "posts/dislikes",
  async (payload, { rejectWithValue, getState }) => {
    //Make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/dislike/${payload}`,
        {},
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!views post
export const viewsPostAction = createAsyncThunk(
  "posts/views",
  async (payload, { rejectWithValue, getState }) => {
    //Make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/views/${payload}`,
        {},
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!Clap post
export const clapsPostAction = createAsyncThunk(
  "posts/claps",
  async (payload, { rejectWithValue, getState }) => {
    //Make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/posts/claps/${payload}`,
        {},
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Posts Slice
const postsSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //Fetch Posts  public action
    builder.addCase(fetchPublicPostsAction.pending, (state) => {
      state.loading = true;
      state.success = null;
    });

    builder.addCase(fetchPublicPostsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.posts = action.payload;
    });

    builder.addCase(fetchPublicPostsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.success = false;
      state.loading = false;
    });

    //Get posts list
    builder.addCase(PostsListAction.pending, (state) => {
      state.loading = true;
      state.success = null;
    });

    builder.addCase(PostsListAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.posts = action.payload;
    });

    builder.addCase(PostsListAction.rejected, (state, action) => {
      state.error = action.payload;
      state.success = false;
      state.loading = false;
    });

    //Get Single post
    builder.addCase(getPostAction.pending, (state) => {
      state.loading = true;
      state.success = null;
    });

    builder.addCase(getPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.post = action.payload;
    });

    builder.addCase(getPostAction.rejected, (state, action) => {
      state.error = action.payload;
      state.success = false;
      state.loading = false;
    });

    //Create Action
    builder.addCase(createPostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(createPostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //Update Post
    builder.addCase(updatePostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //Delete post
    builder.addCase(deletePostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //Likes post
    builder.addCase(likesPostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(likesPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(likesPostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //DisLikes post
    builder.addCase(disLikesPostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(disLikesPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(disLikesPostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //Claps post
    builder.addCase(clapsPostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(clapsPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(clapsPostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //Views post
    builder.addCase(viewsPostAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(viewsPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = "success";
      state.post = action.payload;
    });
    builder.addCase(viewsPostAction.rejected, (state, action) => {
      state.error = action?.payload;
      state.loading = false;
      state.success = false;
    });

    //Reset Success action
    builder.addCase(resetErrorAction, (state) => {
      state.error = null;
    });

    builder.addCase(resetSuccessAction, (state) => {
      state.success = false;
    });
  },
});

//Create post slice

const postsReducer = postsSlice.reducer;

export default postsReducer;
