import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { debounce } from "lodash";

import { Divider, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

import EmumbaLogo from "../../assets/images/Emumba-logo.svg";
import { RootState } from "../../store/root-reducer";
import {
  fetchGistById,
  fetchStarredGists,
  fetchUserProfile,
  LoginWithGithub,
} from "../../utilities/utils";
import {
  setUser,
  selectIsLoggedIn,
  setUserGithubProfile,
  setStarredGist,
  clearUser,
  setGithubUserName,
} from "../../store/user/user.slice";
import {
  setGistLoading,
  setPage,
  setSearchedGist,
  setSearchQuery,
} from "../../store/gists/gists.slice";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, userGithubProfile, trigger } = useSelector(
    (state: RootState) => state.user
  );
  const { searchQuery } = useSelector((state: RootState) => state.gists);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogoClick = () => {
    dispatch(setPage(1));
  };

  const handleLogin = async () => {
    const { user, token } = await LoginWithGithub();

    dispatch(
      setUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Unknown User",
        token: token ?? null,
        photoUrl: user.photoURL,
      })
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      dispatch(clearUser());
      setAnchorEl(null);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "") {
      dispatch(setSearchQuery(e.target.value));
    } else {
      dispatch(setSearchQuery(""));
    }
  };

  const debouncedSearchQuery = debounce(handleSearchQuery, 500);

  useEffect(() => {
    const fetchGists = async () => {
      if (!user.token) return;
      const data = await fetchUserProfile(user.token);
      dispatch(setGithubUserName(data.login));
      dispatch(setUserGithubProfile(data.html_url));
    };

    fetchGists();
  }, [dispatch, user]);

  useEffect(() => {
    const fetchGist = async () => {
      const gist = await fetchGistById(searchQuery, user?.token); // Make sure to pass the token if needed
      if (gist) {
        dispatch(setSearchedGist(gist));
        dispatch(setGistLoading(false));
      } else {
        dispatch(setSearchedGist(null));
        dispatch(setGistLoading(true));
      }
    };
    if (searchQuery) {
      dispatch(setGistLoading(true));
      fetchGist();
    } else {
      dispatch(setGistLoading(false));
      dispatch(setSearchedGist(null));
    }
  }, [dispatch, searchQuery, user?.token]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.token) {
        const gists = await fetchStarredGists(user.token);
        dispatch(setStarredGist(gists));
      }
    };
    fetchData();
  }, [dispatch, user.token, trigger]);

  return (
    <nav className="navbar text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to={"/"}>
          <div
            onClick={handleLogoClick}
            className="text-2xl font-bold cursor-pointer"
          >
            <img src={EmumbaLogo} alt="Emumba Logo" />
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-4  rounded">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="Search gists..."
              onChange={(e) => {
                e.stopPropagation();
                if (location.pathname === "/") {
                  debouncedSearchQuery(e);
                }
              }}
              className="w-64 pl-10 pr-4 py-2 border border-[#FFFFFF80] text-white bg-[#003b44] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#005f67]"
            />
          </div>
          {isLoggedIn ? (
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <img
                  src={user.photoUrl ?? ""}
                  alt="John Doe"
                  className="w-10 h-10 rounded-full"
                />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <Typography variant="subtitle2">Signed in as</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      paddingBottom: 0,
                      color: "#003B44",
                    }}
                  >
                    {user.name}
                  </Typography>
                </MenuItem>
                <Divider />
                <Link to={"/user-profile"}>
                  <MenuItem onClick={handleClose}>Your gists</MenuItem>
                </Link>
                <Link to={"/create-gists"}>
                  <MenuItem onClick={handleClose}>Create gist</MenuItem>
                </Link>
                <a href={userGithubProfile} target="blank">
                  <MenuItem onClick={handleClose}>Your GitHub profile</MenuItem>
                </a>
                <Divider />
                <a href="https://docs.github.com/en" target="blank">
                  <MenuItem onClick={handleClose}>Help</MenuItem>
                </a>
                <MenuItem onClick={handleLogout}>Sign out</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              sx={{ textTransform: "none" }}
              className="!bg-white w-20 !text-[#003B44] !font-semibold !text-[12px] rounded"
            >
              Login
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/*Mobile View */}

      {isOpen && (
        <div className="md:hidden w-full bg-[#003B44] flex  items-center space-y-4 mt-4">
          <div className="relative w-full px-4">
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="Search gists..."
              className="w-full pl-12 pr-4 py-2 border  border-[#FFFFFF80] border-white rounded bg-[#003b44] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00797e]"
            />
          </div>

          {isLoggedIn ? (
            <div className="!mt-0">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <img
                  src={user.photoUrl ?? ""}
                  alt="John Doe"
                  className="w-10 h-10 rounded-full"
                />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle2">Signed in as</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      paddingBottom: 0,
                      color: "#003B44",
                      cursor: "default",
                    }}
                  >
                    {user.name}
                  </Typography>
                </MenuItem>
                <Divider />

                <MenuItem onClick={handleClose}>Your gists</MenuItem>
                <Link to={"/create-gists"}>
                  <MenuItem>Create gist</MenuItem>
                </Link>
                <a href={userGithubProfile} target="blank">
                  <MenuItem onClick={handleClose}>Your GitHub profile</MenuItem>
                </a>
                <Divider />
                <a href="https://docs.github.com/en" target="blank">
                  <MenuItem onClick={handleClose}>Help</MenuItem>
                </a>
                <MenuItem onClick={handleLogout}>Sign out</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              sx={{ textTransform: "none" }}
              className="!bg-white w-20 !text-[#003B44] !font-semibold !text-[12px] rounded"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
