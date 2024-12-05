import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    uid: string | null;
    email: string | null;
    name: string | null;
    token: string | null;
    photoUrl: string | null;
  };
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
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
