import { useState } from "react";
import EmumbaLogo from "../../assets/images/Emumba-logo.svg";
import { Button } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { LoginWithGithub } from "../../utilities/utils";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/user/user.slice";
import { auth } from "../../../firebaseConfig";
import { signOut } from "firebase/auth";

const Header = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

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
    console.log("🚀 ~ handleLogin ~ token:", token);
    console.log("🚀 ~ handleLogin ~ user:", user);
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);

      dispatch(clearUser());

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

          <Button
            onClick={handleLogin}
            sx={{ textTransform: "none" }}
            className="!bg-white w-20 !text-[#003B44] !font-semibold !text-[12px] rounded"
          >
            Login
          </Button>
          <Button
            onClick={handleLogout}
            sx={{ textTransform: "none" }}
            className="!bg-white w-20 !text-[#003B44] !font-semibold !text-[12px] rounded"
          >
            Logout
          </Button>
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
