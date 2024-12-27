import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { RootState } from "../../store/root-reducer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGistDetails,
  fetchGistsByUser,
  formatCreatedAt,
  starGist,
} from "../../utilities/utils";
import { useEffect, useState } from "react";
import { Gist } from "../../utilities/types";
import { toast } from "react-toastify";
import starIcon from "../../assets/images/star-icon.svg";
import StarIcon from "@mui/icons-material/Star";
import { setPage, setStarred } from "../../store/gists/gists.slice";
import { selectIsLoggedIn, setTrigger } from "../../store/user/user.slice";
import { Link } from "react-router";
import rightIcon from "../../assets/images/righIcon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";

const UserProfile = () => {
  const dispatch = useDispatch();
  const {
    user,
    userGithubProfile,
    githubUserName,
    starredGists,
    userGistsCount,
    trigger,
  } = useSelector((state: RootState) => state.user);
  const { page } = useSelector((state: RootState) => state.gists);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [gists, setGists] = useState<Gist[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { star: boolean };
  }>({});
  const [gistContents, setGistContents] = useState<{ [key: string]: string }>(
    {}
  );
  const totalNumberOfPages = Math.ceil(userGistsCount / 2);

  useEffect(() => {
    const fetchContents = async () => {
      if (!gists) return;
      setLoading(true);
      const contents: { [key: string]: string } = {};
      for (const gist of gists) {
        const content = await fetchGistDetails(
          gist.id,
          user?.token ? user?.token : ""
        );
        contents[gist.id] = content[0].content;
      }
      setGistContents(contents);
      setLoading(false);
    };

    if (gists && gists.length > 0) {
      fetchContents();
    }
  }, [dispatch, gists, user.token]);

  const handleStarClick = async (gistId: string, token: string | null) => {
    if (!token) return;
    setLoadingStates((prev) => ({
      ...prev,
      [gistId]: { ...prev[gistId], star: true },
    }));
    try {
      const response = await starGist(gistId, token);
      if (response) {
        toast.success("Gist Starred successfully! 🚀");
        dispatch(setStarred({ gistId, isStarred: true }));
        dispatch(setTrigger());
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], star: false },
        }));
      }
    } catch (error) {
      if (error) toast.error("Something Went Wrong ");
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    dispatch(setPage(page + 1));
  };

  useEffect(() => {
    const fetchGists = async () => {
      if (!user.token) return;

      try {
        setLoading(true);

        const fetchedGists = await fetchGistsByUser(
          githubUserName,
          user.token,
          page,
          2
        );

        if (fetchedGists) {
          setGists(fetchedGists);
        } else {
          toast.warn("No Gists Found!");
        }
      } catch (err) {
        console.error("Error fetching gists:", err);
        toast.error("An error occurred while fetching gists.");
      } finally {
        setLoading(false);
      }
    };

    fetchGists();
  }, [githubUserName, user.token, page, trigger]);

  const cardRenderer = (gist: Gist) => {
    if (!gist) return null;
    return (
      <Card
        key={gist.id}
        className={`w-[100%] h-[230px] mb-4 max-h-[250px] rounded-md shadow-md card `}
      >
        <Link to={`/public-gist-view/${gist.id}`}>
          <Box
            className="p-2 bg-[#f5f5f5] overflow-hidden rounded-t-md flex items-center cursor-pointer flex-col"
            style={{ height: "140px" }}
          >
            {loading ? (
              <>
                <Skeleton variant="text" width="50%" height="30%" />
                <Skeleton variant="text" width="80%" height="30%" />
                <Skeleton variant="text" width="100%" height="30%" />
              </>
            ) : (
              <pre
                className="text-[12px] leading-[1.4] overflow-auto w-full max-h-full"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {gistContents[gist.id]
                  ? gistContents[gist.id].slice(0, 300) // Show the first 200 characters and add "..."
                  : "No preview available"}
              </pre>
            )}
          </Box>
        </Link>
        <CardContent className="flex items-start p-4 gap-4  relative">
          <Avatar
            src={gist.owner.avatar_url}
            alt="User Photo"
            className="w-12 h-12"
          />
          <Box>
            <Typography
              variant="subtitle1"
              className="!text-[14px] !leading-8 mt-1 "
            >
              <span className="mt-1 truncate w-[60%]">{gist.owner.login}</span>
              {Object.values(gist.files)[0]?.filename && (
                <>
                  {" / "}
                  <span className="!font-semibold">
                    {Object.values(gist.files)[0]?.filename}
                  </span>
                </>
              )}
            </Typography>
            <Typography variant="body2" className="text-[#7A7A7A]">
              {formatCreatedAt(gist.created_at)}
            </Typography>
            <Typography
              variant="body2"
              className="text-[#7A7A7A] mt-1 truncate w-[60%]"
            >
              {gist.description}
            </Typography>
            <div className="p-3 flex items-center justify-end card-lower-icons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarClick(gist.id, user?.token);
                }}
                className="p-3 hover:bg-gray-200 rounded-full"
              >
                {loadingStates[gist.id]?.star ? (
                  <CircularProgress className="!text-[#003B44]" size={20} />
                ) : starredGists.some(
                    (starredGist: Gist) => starredGist.id === gist.id
                  ) && isLoggedIn ? (
                  <StarIcon />
                ) : (
                  <img
                    src={starIcon}
                    className="fork-star-icon"
                    alt="filled-star"
                  />
                )}
              </button>
            </div>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (!gists) return;

  return (
    <>
      <div className="layout flex gap-20">
        <Box className=" flex flex-col items-center justify-start gap-5 ">
          <img
            style={{ width: "200px", height: "200px" }}
            className="rounded-full"
            src={user.photoUrl ?? ""}
            alt="photo-url"
          />
          <Typography className="!text-[25px] ">{user.name}</Typography>
          <a href={userGithubProfile} target="blank">
            <button className="px-7 py-3 min-w-[200px] bg-[#003B44] text-white rounded-lg shadow focus:outline-none ">
              View Github Profile
            </button>
          </a>
        </Box>
        <Box>
          <Box className="flex  gap-2 items-center">
            <Typography className="!text-[25px] ">All Gist</Typography>
            <Typography className="bg-green-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {userGistsCount}
            </Typography>
          </Box>
          <Box className="w-[50%] md:w-[700px] lg:w-[1000px]">
            {gists?.slice(0, 2).map((gist) => cardRenderer(gist))}
          </Box>
        </Box>
      </div>

      {/*Table Footer */}
      <table className="w-[95%] border-collapse rounded-lg">
        <tfoot>
          <tr>
            <td colSpan={5} className="p-3">
              <Box className="flex justify-end items-center gap-10 ">
                <img
                  onClick={handlePreviousPage}
                  src={leftIcon}
                  alt="Previous Page"
                  className={`${page === 1 ? "" : "cursor-pointer"}`}
                />
                <div className=" !text-[14px] !font-normal text-[#3D3D3D] flex   items-center  gap-4">
                  Page
                  <span className="border px-2 py-1 rounded-md">{page}</span>
                  of {totalNumberOfPages}
                </div>
                <img
                  onClick={handleNextPage}
                  src={rightIcon}
                  alt="Next Page"
                  className="cursor-pointer"
                />
              </Box>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default UserProfile;
