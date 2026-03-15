import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalSlices/GlobalSlice";

const INITIAL_STATE = {
  error: null,
  success: null,
  loading: false,
  categories: [],
  category: null,
};

export const fetchCategoriesAction = createAsyncThunk(
  "categories/lists",
  async (payload, { rejectWithValue }) => {
    //make a request
    try {
      //fetch category
      const { data } = await axios.get(
        "http://localhost:8040/api/v1/Categories"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.message);
    }
  }
);
//Create slice

const categoriesSlice = createSlice({
  name: "categories",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //fetch categories
    builder.addCase(fetchCategoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.error = action.payload;
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

const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;
