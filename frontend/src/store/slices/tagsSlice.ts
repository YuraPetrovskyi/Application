import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Tag } from "../../types";

interface TagsState {
  tags: Tag[];
  loading: boolean;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
};

export const fetchTags = createAsyncThunk("tags/fetchAll", async () => {
  const res = await api.get<Tag[]>("/tags");
  return res.data;
});

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default tagsSlice.reducer;
