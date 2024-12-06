import { useState } from "react";
import EmumbaLogo from "../../assets/images/Emumba-logo.svg";
import { FaSearch } from "react-icons/fa";
import { LoginWithGithub } from "../../utilities/utils";
import { useDispatch } from "react-redux";
import {
  setUser,
  clearUser,
  selectIsLoggedIn,
} from "../../store/user/user.slice";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { Divider, Typography } from "@mui/material";

const Header = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <nav className="navbar text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold">
          <img src={EmumbaLogo} alt="Emumba Logo" />
        </div>

        <div className="hidden md:flex items-center space-x-4  rounded">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="Search gists..."
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
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", paddingBottom: 0 }}
                  >
                    Signed in as
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", paddingBottom: 0 }}
                  >
                    {user.name}
                  </Typography>
                </MenuItem>
                <Divider />

                <MenuItem onClick={handleClose}>Your gists</MenuItem>
                <MenuItem onClick={handleClose}>Starred gists</MenuItem>
                <MenuItem onClick={handleClose}>Your GitHub profile</MenuItem>
                <Divider />

                <MenuItem onClick={handleClose}>Help</MenuItem>
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

      {isOpen && (
        <div className="md:hidden w-full bg-[#003B44] flex flex-col items-center space-y-4 mt-4">
          <div className="relative w-full px-4">
            <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white" />
            <input
              type="text"
              placeholder="Search gists..."
              className="w-full pl-12 pr-4 py-2 border  border-[#FFFFFF80] border-white rounded bg-[#003b44] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00797e]"
            />
          </div>

          <Button
            sx={{ textTransform: "none" }}
            className="w-24 !bg-white !text-[#003B44] !font-semibold !text-[12px] rounded"
          >
            Login
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Header;
