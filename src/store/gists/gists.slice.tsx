import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { publicGistInterface } from "../../utilities/types";

interface GistState {
  gists: publicGistInterface[];
  loading: boolean;
  page: number;
}

const initialState: GistState = {
  gists: [],
  loading: false,
  page: 2,
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

    clearGists: (state) => {
      state.gists = [];
    },
  },
});

export const { setGists, setLoading, setPage, clearGists } = gistSlice.actions;

export default gistSlice.reducer;
