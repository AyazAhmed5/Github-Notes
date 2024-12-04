import "./App.css";
import Header from "./components/header/header";
import { Route, Routes } from "react-router";
import ListViewGists from "./pages/list-view-gists/ListViewGists";
import CardViewGists from "./pages/card-view-gists/CardViewGists";
import UserProfile from "./pages/user-profile/UserProfile";
import CreateGists from "./pages/create-gists/createGists";
import PublicGistView from "./pages/public-gist-view/PublicGistView";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<ListViewGists />} />
        <Route path="/card-view" element={<CardViewGists />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/create-gists" element={<CreateGists />} />
        <Route path="/public-gist-view/:id" element={<PublicGistView />} />
      </Routes>
    </div>
  );
}

export default App;
