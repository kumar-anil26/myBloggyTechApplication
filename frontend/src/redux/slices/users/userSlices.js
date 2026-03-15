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
  users: [],
  user: null,
  isUpdated: false,
  isDeleted: false,
  isEmailSent: false,
  isPasswordReset: false,
  profile: {},
  userAuth: {
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//Register Action
export const registerAction = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    //make Request
    try {
      console.log("users profile fetching start");
      const { data } = await axios.post(
        "https://my-bloggy-tech-server-application.vercel.app/api/v1/users/register",
        payload
      );
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//@ Desc Login Action
//Login Action
//getState, dispatch it can't insert beside rejectWithValue

export const loginAction = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    //make Request
    try {
      const { data } = await axios.post(
        "https://my-bloggy-tech-server-application.vercel.app/api/v1/users/login",
        payload
      );
      localStorage.setItem("userInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//@ Desc forgot Password

export const forgotPasswordAction = createAsyncThunk(
  "user/forgot-password",
  async (payload, { rejectWithValue }) => {
    console.log(payload.email);
    try {
      
      const data = await axios.post(
        "https://my-bloggy-tech-server-application.vercel.app/api/v1/users/forgot-password",
        payload
      );
      console.log("data is ",data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

//Update Profile PIc
export const updateProfilePictureAction = createAsyncThunk(
  "users/update-profile-picture",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const formData = new FormData();
      formData.append("file", payload?.data?.file);

      console.log("user id is ", payload.data.file.name);
      const { data } = await axios.post(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/profile-picture/${payload?.data?.userId}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Update cover Image
export const updateCoverImageAction = createAsyncThunk(
  "users/update-cover-image",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const formData = new FormData();
      formData.append("file", payload?.data?.file);

      console.log("user id is ", payload.data.file.name);
      const { data } = await axios.post(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/cover-image/${payload?.data?.userId}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//!Logout Action

export const LogoutAction = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("userInfo");
  return true;
});

//Get Public profile
export const getPublicProfileAction = createAsyncThunk(
  "users/public-profile",
  async (payload, { rejectWithValue, getState }) => {
    try {
      //  Access the token from Redux state
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //  Fetch public profile by user ID or username (payload)
      const { data } = await axios.get(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/public-profile/${payload}`,
        config
      );

      return data;
    } catch (error) {
      // Gracefully handle API errors
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

//Get private profiel Action

export const getPrivateProfileAction = createAsyncThunk(
  "users/private-profile",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/private-profile`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

//Follow

export const userFollowAction = createAsyncThunk(
  "users/follow",
  async (payload, { rejectWithValue, getState }) => {
    try {
      console.log("user Follow action running...", payload);
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log("jwt is  ", config);
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/following/${payload}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

//Unfollowing

export const userUnFollowAction = createAsyncThunk(
  "users/unfollow",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/unfollow/${payload}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

//Block

export const userBlockAction = createAsyncThunk(
  "users/block",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/block/${payload}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

//UnBlock

export const userUnBlockAction = createAsyncThunk(
  "users/unBlock",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `https://my-bloggy-tech-server-application.vercel.app/api/v1/users/unblock/${payload}`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

// create slice
const userSlice = createSlice({
  name: "users",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //login
    builder.addCase(loginAction.pending, (state) => {
      console.log("pending");
      state.loading = true;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      (state.loading = false),
        (state.success = true),
        (state.error = null),
        (state.userAuth.userInfo = action.payload);
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      (state.loading = false),
        (state.success = false),
        (state.error = action.payload);
    });

    // Forgot password
    builder.addCase(forgotPasswordAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(forgotPasswordAction.fulfilled, (state) => {
      (state.loading = false), (state.success = true), (state.error = null);
    });
    builder.addCase(forgotPasswordAction.rejected, (state, action) => {
      (state.success = false), (state.error = action.payload);
    });
    //Register
    builder.addCase(registerAction.pending, (state) => {
      console.log(" Reg pending!");
      state.loading = true;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      (state.loading = false),
        (state.success = true),
        (state.error = null),
        (state.user = action.payload);
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      (state.loading = false),
        (state.success = false),
        (state.error = action.payload);
    });

    //update profile pic slice
    builder.addCase(updateProfilePictureAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfilePictureAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.user = action.payload;
    });
    builder.addCase(updateProfilePictureAction.rejected, (state, action) => {
      state.success = false;
      state.loading = false;
      state.error = action.payload;
    });

    //Update Cover image
    builder.addCase(updateCoverImageAction.pending, (state) => {
      console.log("update profile is pending");
      state.loading = true;
    });
    builder.addCase(updateCoverImageAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.user = action.payload;
    });
    builder.addCase(updateCoverImageAction.rejected, (state, action) => {
      state.success = false;
      state.loading = false;
      state.error = action.payload;
    });

    // Get Public Profile Slice
    builder
      .addCase(getPublicProfileAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getPublicProfileAction.fulfilled, (state, action) => {
        state.loading = false;
        // state.success = true;
        state.error = null;
        state.profile = action.payload;
      })
      .addCase(getPublicProfileAction.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });

    // Get Private Profile Slice
    builder
      .addCase(getPrivateProfileAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getPrivateProfileAction.fulfilled, (state, action) => {
        state.loading = false;
        // state.success = true;
        state.error = null;
        state.profile = action.payload;
      })
      .addCase(getPrivateProfileAction.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Something went wrong";
      });

    //Follow Slice
    builder.addCase(userFollowAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(userFollowAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = action.payload;
    });
    builder.addCase(userFollowAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //UnFollow
    builder.addCase(userUnFollowAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(userUnFollowAction.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      // state.success = action.payload
    });
    builder.addCase(userUnFollowAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //Block
    builder.addCase(userBlockAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(userBlockAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = action.payload;
    });
    builder.addCase(userBlockAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //UnBlock
    builder.addCase(userUnBlockAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(userUnBlockAction.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      // state.success = action.payload
    });
    builder.addCase(userUnBlockAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //Reset Error action
    builder.addCase(resetErrorAction, (state) => {
      state.error = null;
    });
    //Reset Success action
    builder.addCase(resetSuccessAction, (state) => {
      state.success = false;
    });
  },
});

const usersReducer = userSlice.reducer;
export default usersReducer;
