import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string | null;
  email: string | null;
  name: string | null;
  token: string | null;
  photoUrl: string | null;
}

interface UserState {
  user: User;
}

const initialState: UserState = {
  user: {
    uid: null,
    email: null,
    name: null,
    token: null,
    photoUrl: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectIsLoggedIn = (state: { user: UserState }) =>
  !!state.user.user?.uid;

export const selectUser = (state: { user: UserState }) => state.user.user;

export default userSlice.reducer;
