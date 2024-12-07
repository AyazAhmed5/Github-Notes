import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utilities/types";

interface UserState {
  user: User;
  userGithubProfile: string;
}

const initialState: UserState = {
  user: {
    uid: null,
    email: null,
    name: null,
    token: null,
    photoUrl: null,
  },
  userGithubProfile: "",
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
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser, setUserGithubProfile } = userSlice.actions;

export const selectIsLoggedIn = (state: { user: UserState }) =>
  !!state.user.user?.uid;

export default userSlice.reducer;
