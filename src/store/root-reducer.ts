import { combineReducers } from "redux";
import userReducer from "./user/user.slice";

export type RootState = ReturnType<typeof rootReducer>;

// Root Reducer
const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
