/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import { Route, Routes } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/header/header";
import CreateGists from "./pages/create-gists/createGists";
import UserProfile from "./pages/user-profile/userProfile";
import LandingPage from "./pages/landing-page/landingPage";
import PublicGistView from "./pages/public-gist-view/publicGistView";
import StarredGistView from "./pages/starred-gists/starredGistView";

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
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/starred-gists" element={<StarredGistView />} />
          <Route path="/create-gists" element={<CreateGists />} />
          <Route path="/public-gist-view/:id" element={<PublicGistView />} />
        </Routes>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          theme="light"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
