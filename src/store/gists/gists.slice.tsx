import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gist, GistState, publicGistInterface } from "../../utilities/types";

const initialState: GistState = {
  gists: [],
  loading: false,
  gistLoading: false,
  page: 1,
  searchQuery: "",
  searchedGist: null,
};

const gistSlice = createSlice({
  name: "gists",
  initialState,
  reducers: {
    setGists: (state, action: PayloadAction<publicGistInterface[]>) => {
      state.gists = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGistLoading: (state, action: PayloadAction<boolean>) => {
      state.gistLoading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchedGist: (state, action: PayloadAction<Gist | null>) => {
      state.searchedGist = action.payload;
    },
    setStarred: (
      state,
      action: PayloadAction<{ gistId: string; isStarred: boolean }>
    ) => {
      const gist = state.gists.find(
        (gist) => gist.id === action.payload.gistId
      );
      if (gist) {
        gist.isStarred = action.payload.isStarred;
      }
    },
  },
});

export const {
  setGists,
  setLoading,
  setPage,
  setStarred,
  setSearchedGist,
  setSearchQuery,
  setGistLoading,
} = gistSlice.actions;

export default gistSlice.reducer;
