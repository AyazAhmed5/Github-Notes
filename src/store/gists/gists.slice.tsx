import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { publicGistInterface } from "../../utilities/types";

interface GistState {
  gists: publicGistInterface[];
  loading: boolean;
  page: number;
  searchQuery: string;
}

const initialState: GistState = {
  gists: [],
  loading: false,
  page: 1,
  searchQuery: "",
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
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
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

export const { setGists, setLoading, setPage, setStarred, setSearchQuery } =
  gistSlice.actions;

export default gistSlice.reducer;
