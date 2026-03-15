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
  comments: [],
  comment: null,
};

// 🧩 Create Comment Thunk
export const CreateCommentsAction = createAsyncThunk(
  "comments/create-comments",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:8040/api/v1/comments/${payload.Id}`,
        { message: payload.message },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

//  Comments Slice
const commentsSlice = createSlice({
  name: "comments",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    builder
      .addCase(CreateCommentsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateCommentsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.comment = action.payload; // ✅ updated comment
      })
      .addCase(CreateCommentsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset actions
      .addCase(resetErrorAction, (state) => {
        state.error = null;
      })
      .addCase(resetSuccessAction, (state) => {
        state.success = false;
      });
  },
});

const commentsReducer = commentsSlice.reducer;

export default commentsReducer;
