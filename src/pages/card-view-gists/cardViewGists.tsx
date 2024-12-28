import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Skeleton,
  CircularProgress,
  Popover,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import { RootState } from "../../store/root-reducer";
import { Gist } from "../../utilities/types";
import {
  fetchGistDetails,
  forkGist,
  formatCreatedAt,
  starGist,
} from "../../utilities/utils";
import { setStarred } from "../../store/gists/gists.slice";
import { setLoading } from "../../store/gists/gists.slice";
import { selectIsLoggedIn, setTrigger } from "../../store/user/user.slice";
import ForkIcon from "../../assets/images/forkIcon.svg";
import starIcon from "../../assets/images/star-icon.svg";
import { Link } from "react-router";

const CardViewGists = () => {
  const dispatch = useDispatch();
  const { gists, loading, gistLoading, searchedGist, searchQuery } =
    useSelector((state: RootState) => state.gists);
  const { user, starredGists } = useSelector((state: RootState) => state.user);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { fork: boolean; star: boolean };
  }>({});
  const [gistContents, setGistContents] = useState<{ [key: string]: string }>(
    {}
  );
  const noResultFound =
    searchedGist === null && searchQuery && !gistLoading ? true : false;

  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchContents = async () => {
      dispatch(setLoading(true));
      const contents: { [key: string]: string } = {};
      for (const gist of gists) {
        const gistDetail = await fetchGistDetails(
          gist.id,
          user?.token ? user?.token : ""
        );
        contents[gist.id] = gistDetail[0].content;
      }
      setGistContents(contents);
      dispatch(setLoading(false));
    };

    if (gists.length > 0) {
      fetchContents();
    }
  }, [dispatch, gists, user.token]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleForkClick = async (gistId: string, token: string | null) => {
    if (!token) return;
    setLoadingStates((prev) => ({
      ...prev,
      [gistId]: { ...prev[gistId], fork: true },
    }));
    try {
      const forkedGist = await forkGist(gistId, token);

      if (forkedGist) {
        toast.success("Gist forked successfully! 🚀");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], fork: false },
        }));
      }
    } catch (error) {
      if (error) toast.error("Something Went Wrong ");
    }
  };

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
  const renderSingleRow = () => {
    return (
      <tr className="border-b border-l border-r">
        <td className="p-3 text-center" colSpan={100}>
          No Result found
        </td>
      </tr>
    );
  };

  const cardRenderer = (gist: Gist, temp?: boolean) => {
    if (!gist) return null;
    return (
      <Card
        key={gist?.id}
        className={`${temp ? "w-[100%]" : "w-[385px]"} h-[228px] ${temp ? "" : "max-w-[390px]"} max-h-[290px] rounded-md shadow-md card `}
      >
        <Link to={`/public-gist-view/${gist?.id}`}>
          <Box
            className="p-2 bg-[#f5f5f5] overflow-hidden rounded-t-md flex items-center flex-col cursor-pointer"
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
                className="text-[12px] leading-[1.4] overflow-hidden w-full max-h-full"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {gistContents[gist?.id]
                  ? gistContents[gist?.id].slice(0, 200) + "..." // Show the first 200 characters and add "..."
                  : "No preview available"}
              </pre>
            )}
          </Box>
        </Link>
        <CardContent className="flex items-start p-4 gap-4  relative">
          <Avatar
            src={gist?.owner?.avatar_url}
            alt="User Photo"
            className="w-12 h-12"
          />
          <Box>
            <Typography
              variant="subtitle1"
              className="!text-[14px] !leading-8 mt-1 truncate !w-[70%]"
            >
              <span className="mt-1 !truncate !w-[60%]">
                {gist?.owner?.login}
              </span>
              <span className="mt-1 !truncate !w-[40%] ">
                {Object.values(gist?.files)[0]?.filename && (
                  <>
                    {" / "}
                    <span className="truncate !w-[40%] !font-semibold">
                      {Object.values(gist?.files)[0]?.filename}
                    </span>
                  </>
                )}
              </span>
            </Typography>
            <Typography variant="body2" className="text-[#7A7A7A] !text-[11px]">
              {formatCreatedAt(gist?.created_at)}
            </Typography>
            <Typography
              variant="body2"
              className="text-[#7A7A7A] mt-1 truncate w-[40%]  !text-[11px]"
            >
              {gist?.description}
            </Typography>
            <div className="p-3 flex items-center justify-end card-lower-icons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLoggedIn) {
                    handleForkClick(gist?.id, user?.token);
                  } else {
                    handleClick(e);
                  }
                }}
                className="p-3 hover:bg-gray-200 rounded-full"
              >
                {loadingStates[gist?.id]?.fork ? (
                  <CircularProgress className="!text-[#003B44]" size={20} />
                ) : (
                  <img
                    src={ForkIcon}
                    className="fork-star-icon"
                    alt="fork-icon"
                  />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLoggedIn) {
                    handleStarClick(gist?.id, user?.token);
                  } else {
                    handleClick(e);
                  }
                }}
                className="p-3 hover:bg-gray-200 rounded-full"
              >
                {loadingStates[gist?.id]?.star ? (
                  <CircularProgress className="!text-[#003B44]" size={20} />
                ) : starredGists.some(
                    (starredGist: Gist) => starredGist?.id === gist?.id
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
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                onClick={(e) => e.stopPropagation()}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Typography sx={{ p: 2 }}>
                  Please login first in order to perform this action!!
                </Typography>
              </Popover>
            </div>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mb-3">
      {gistLoading ? (
        <>
          <div className="loading-skeleton" />
          <div className="loading-skeleton" />
          <div className="loading-skeleton" />
          <div className="loading-skeleton" />
          <div className="loading-skeleton" />
        </>
      ) : searchedGist ? (
        cardRenderer(searchedGist, true)
      ) : noResultFound ? (
        renderSingleRow()
      ) : (
        gists?.map((gist) => cardRenderer(gist, false))
      )}
    </div>
  );
};

export default CardViewGists;
