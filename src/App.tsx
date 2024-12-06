/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import { Route, Routes } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material";

import Header from "./components/header/header";
import CreateGists from "./pages/create-gists/createGists";
import UserProfile from "./pages/user-profile/userProfile";
import LandingPage from "./pages/landing-page/landingPage";
import CardViewGists from "./pages/card-view-gists/cardViewGists";
import PublicGistView from "./pages/public-gist-view/publicGistView";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./store/user/user.slice"; // Adjust the path based on your project structure
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Import your Firebase config

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName || "Unknown User",
            token: user.accessToken,
            photoUrl: user.photoURL,
          })
        );
      } else {
        // If the user is logged out, clear the user data from Redux state
        dispatch(clearUser());
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/card-view" element={<CardViewGists />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/create-gists" element={<CreateGists />} />
          <Route path="/public-gist-view/:id" element={<PublicGistView />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
