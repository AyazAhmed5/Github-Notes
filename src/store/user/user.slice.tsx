import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gist, User, UserState } from "../../utilities/types";

const initialState: UserState = {
  user: {
    uid: null,
    email: null,
    name: null,
    token: null,
    photoUrl: null,
  },
  starredGists: [],
  userGithubProfile: "",
  trigger: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserGithubProfile: (state, action: PayloadAction<string>) => {
      state.userGithubProfile = action.payload;
    },
    setStarredGist: (state, action: PayloadAction<Gist[]>) => {
      state.starredGists = action.payload;
    },
    setTrigger: (state) => {
      state.trigger = !state.trigger;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const {
  setUser,
  clearUser,
  setStarredGist,
  setUserGithubProfile,
  setTrigger,
} = userSlice.actions;

export const selectIsLoggedIn = (state: { user: UserState }) =>
  !!state.user.user?.uid;

export default userSlice.reducer;
