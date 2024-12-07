import { combineReducers } from "redux";
import userReducer from "./user/user.slice";
import gistReducer from "./gists/gists.slice";

export type RootState = ReturnType<typeof rootReducer>;

// Root Reducer
const rootReducer = combineReducers({
  user: userReducer,
  gists: gistReducer,
});

export default rootReducer;
