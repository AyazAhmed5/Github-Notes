// import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import StarIcon from "@mui/icons-material/Star";

import ForkIcon from "../../assets/images/forkIcon.svg";
import starIcon from "../../assets/images/star-icon.svg";

import { RootState } from "../../store/root-reducer";
import { forkGist, formatCreatedAt, starGist } from "../../utilities/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { setStarred } from "../../store/gists/gists.slice";
import { setTrigger } from "../../store/user/user.slice";
import { Gist } from "../../utilities/types";
// import { setLoading } from "../../store/gists/gists.slice";

const CardViewGists = () => {
  const { gists, loading } = useSelector((state: RootState) => state.gists);
  const { user, starredGists } = useSelector((state: RootState) => state.user);

  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { fork: boolean; star: boolean };
  }>({});
  const dispatch = useDispatch();

  // const dispatch = useDispatch();
  // const [gistContents, setGistContents] = useState<{ [key: string]: string }>(
  //   {}
  // );
  // useEffect(() => {
  //   const fetchContents = async () => {
  //     dispatch(setLoading(true));
  //     const contents: { [key: string]: string } = {};
  //     for (const gist of gists) {
  //       const content = await fetchGistDetails(gist.id);
  //       contents[gist.id] = content;
  //     }
  //     setGistContents(contents);
  //     dispatch(setLoading(false));
  //   };

  //   if (gists.length > 0) {
  //     fetchContents();
  //   }
  // }, [dispatch, gists]);

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

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mb-3 ">
      {gists.map((gist) => (
        <Card
          key={gist.id}
          className="w-[385px] h-[280px] max-w-[390px] max-h-[290px] rounded-md shadow-md card cursor-pointer"
        >
          <Box
            className="p-2 bg-[#f5f5f5] overflow-hidden rounded-t-md flex items-center  flex-col"
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
                nothing
                {/* {gistContents[gist.id]
                  ? gistContents[gist.id].slice(0, 200) + "..." // Show the first 200 characters and add "..."
                  : "No preview available"} */}
              </pre>
            )}
          </Box>
          <CardContent className="flex items-start p-4 gap-4  relative">
            <Avatar
              src={gist.owner.avatar_url}
              alt="User Photo"
              className="w-12 h-12"
            />
            <Box>
              <Typography
                variant="subtitle1"
                className="!text-[14px] !leading-8 mt-1 truncate w-[80%]"
              >
                <span className="mt-1 truncate w-[60%]">
                  {gist.owner.login}
                </span>
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
                  onClick={() => handleForkClick(gist.id, user?.token)}
                  className="p-3 hover:bg-gray-200 rounded-full"
                >
                  {loadingStates[gist.id]?.fork ? (
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
                  onClick={() => handleStarClick(gist.id, user?.token)}
                  className="p-3 hover:bg-gray-200 rounded-full"
                >
                  {loadingStates[gist.id]?.star ? (
                    <CircularProgress className="!text-[#003B44]" size={20} />
                  ) : starredGists.some(
                      (starredGist: Gist) => starredGist.id === gist.id
                    ) ? (
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
      ))}
    </div>
  );
};

export default CardViewGists;
