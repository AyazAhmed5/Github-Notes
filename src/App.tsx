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

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

function App() {
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
