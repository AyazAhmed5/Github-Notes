/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  fetchGistById,
  fetchGistDetails,
  forkGist,
  formatCreatedAt,
  starGist,
} from "../../utilities/utils";
import {
  Avatar,
  Box,
  CircularProgress,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { Gist } from "../../utilities/types";
import ForkIcon from "../../assets/images/fork-icon-white.svg";
import starIcon from "../../assets/images/star-icon-white.svg";
import React from "react";
import { toast } from "react-toastify";
import { setStarred } from "../../store/gists/gists.slice";
import { selectIsLoggedIn, setTrigger } from "../../store/user/user.slice";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const PublicGistView = () => {
  const { id: paramGistId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, starredGists } = useSelector((state: RootState) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { fork: boolean; star: boolean };
  }>({});
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const open = Boolean(anchorEl);

  const isStarred = starredGists.some(
    (starredGist: Gist) => starredGist.id === paramGistId
  );
  const [gistContents, setGistContents] = useState<any[]>([]);
  const [starCount, setStarCount] = useState<number>(isStarred ? 1 : 0);
  const [forkCount, setForkCount] = useState<number>(0);
  const [selectedGist, setSelectedGist] = useState<Gist>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContents = async () => {
      if (!paramGistId) return;
      setLoading(true);

      try {
        const content = await fetchGistDetails(paramGistId);
        setGistContents(content);

        const gist = await fetchGistById(paramGistId);
        if (gist) {
          setSelectedGist(gist);
        }
      } catch (error) {
        console.error("Error fetching gist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [paramGistId, user?.token]);

  const handleForkClick = async (gistId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [gistId]: { ...prev[gistId], fork: true },
    }));
    try {
      const forkedGist = await forkGist(gistId);

      if (forkedGist) {
        toast.success("Gist forked successfully! 🚀");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], fork: false },
        }));
        setForkCount(1);
      } else {
        toast.error("Something Went Wrong ");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], fork: false },
        }));
      }
    } catch (error) {
      if (error) {
        toast.error("Something Went Wrong ");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], fork: false },
        }));
      }
    }
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleStarClick = async (gistId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [gistId]: { ...prev[gistId], star: true },
    }));
    try {
      const response = await starGist(gistId);
      if (response) {
        toast.success("Gist Starred successfully! 🚀");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], star: false },
        }));
        setStarCount(1);
        dispatch(setStarred({ gistId, isStarred: true }));
        dispatch(setTrigger());
      }
    } catch (error) {
      if (error) {
        toast.error("Something Went Wrong ");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], star: false },
        }));
      }
    }
  };

  if (!selectedGist || !gistContents) return null;
  return (
    <div className="relative">
      <ArrowBackIcon
        className="cursor-pointer absolute top-5 ml-36 "
        onClick={() => {
          navigate(-1);
        }}
      />
      <div className="layout">
        <div className="flex justify-between items-center">
          <Box className="flex items-start p-4 gap-4  relative">
            <Avatar
              src={selectedGist?.owner?.avatar_url}
              alt="User Photo"
              className="w-12 h-12"
            />
            <Box>
              <Typography
                variant="subtitle1"
                className="!text-[14px] !leading-8 mt-1"
              >
                <span className="mt-1 ">{selectedGist?.owner?.login}</span>
                {Object.values(selectedGist.files)[0]?.filename && (
                  <>
                    {" / "}
                    <span className="!font-semibold">
                      {Object.values(selectedGist?.files)[0]?.filename}
                    </span>
                  </>
                )}
              </Typography>
              <Typography variant="body2" className="text-[#7A7A7A]">
                {formatCreatedAt(selectedGist?.created_at)}
              </Typography>
              <Typography variant="body2" className="text-[#7A7A7A] mt-1 ">
                {selectedGist?.description}
              </Typography>
            </Box>
          </Box>
          <div className="flex gap-2">
            <div className="fork-star-container">
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLoggedIn) {
                    handleForkClick(selectedGist.id);
                  } else {
                    handleClick(e);
                  }
                }}
                className={`fork-star-icon-box cursor-pointer`}
              >
                {loadingStates[selectedGist?.id]?.fork ? (
                  <CircularProgress className="!text-white" size={20} />
                ) : (
                  <img
                    src={ForkIcon}
                    className="fork-star-icon"
                    alt="fork-icon"
                  />
                )}
                <Typography className="text-[white] !font-semibold !text-[14px]">
                  Fork
                </Typography>
              </Box>
              <Box className={`icon-box`}>
                {selectedGist?.forks?.length || forkCount}
              </Box>
            </div>
            <div className="fork-star-container">
              <Box
                className={`fork-star-icon-box cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLoggedIn) {
                    handleStarClick(selectedGist.id);
                  } else {
                    handleClick(e);
                  }
                }}
              >
                {loadingStates[selectedGist?.id]?.star ? (
                  <CircularProgress className="!text-white" size={20} />
                ) : starredGists.some(
                    (starredGist: Gist) => starredGist?.id === selectedGist?.id
                  ) && isLoggedIn ? (
                  <StarIcon />
                ) : (
                  <img
                    src={starIcon}
                    className="fork-star-icon"
                    alt="filled-star"
                  />
                )}
                <Typography className="text-[white] !font-semibold !text-[14px]">
                  Star
                </Typography>
              </Box>
              <Box className={`icon-box`}>{starCount}</Box>
            </div>
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
        </div>
        {gistContents.map((gist, index) => (
          <React.Fragment key={index}>
            <Box className="bg-[#FAFAFA] border-b mt-2">
              <Typography
                variant="subtitle1"
                className="!text-[14px] !leading-8 mt-1"
              >
                <span className="mt-1 pl-2">{gist.filename}</span>
              </Typography>
            </Box>
            <Box
              className="p-2 bg-[#FAFAFA] mb-4 overflow-auto rounded-t-md flex items-center flex-col"
              style={{ height: "auto" }}
            >
              {loading ? (
                <>
                  <Skeleton variant="text" width="100%" height="30%" />
                  <Skeleton variant="text" width="100%" height="30%" />
                  <Skeleton variant="text" width="100%" height="30%" />
                  <Skeleton variant="text" width="100%" height="30%" />
                </>
              ) : (
                <SyntaxHighlighter
                  language="javascript"
                  style={docco}
                  wrapLongLines={true}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    color: "green",
                    fontSize: "10px",
                    paddingRight: "10px",
                  }}
                  customStyle={{
                    maxHeight: "80%",
                    fontSize: "12px",
                    lineHeight: "15px",
                    backgroundColor: "#FAFAFA",
                  }}
                >
                  {gist.content}
                </SyntaxHighlighter>
              )}
            </Box>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PublicGistView;
