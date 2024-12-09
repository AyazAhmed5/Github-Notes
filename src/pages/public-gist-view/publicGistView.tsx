/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  fetchGistById,
  fetchGistDetails,
  formatCreatedAt,
} from "../../utilities/utils";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { Gist } from "../../utilities/types";
import ForkIcon from "../../assets/images/fork-icon-white.svg";
import starIcon from "../../assets/images/star-icon-white.svg";

const PublicGistView = () => {
  const { id: paramGistId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  const [gistContents, setGistContents] = useState<string>();
  const [selectedGist, setSelectedGist] = useState<Gist>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContents = async () => {
      if (!paramGistId || !user?.token) return;
      setLoading(true);

      try {
        const content = await fetchGistDetails(paramGistId, user.token);
        setGistContents(content);

        const gist = await fetchGistById(paramGistId, user.token);
        if (gist) {
          setSelectedGist(gist);
        }
      } catch (error) {
        console.error("Error fetching gist data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (paramGistId && user?.token) {
      fetchContents();
    }
  }, [paramGistId, user?.token]);

  if (!selectedGist || !gistContents) return null;
  return (
    <div className="layout">
      <div className="mb-4 flex justify-between items-center">
        <Box className="flex items-start p-4 gap-4  relative">
          <Box className="flex flex-col gap-3 items-center">
            <ArrowBackIcon
              className="cursor-pointer mt-2"
              onClick={() => {
                navigate(-1);
              }}
            />
            <Avatar
              src={selectedGist.owner.avatar_url}
              alt="User Photo"
              className="w-12 h-12"
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              className="!text-[14px] !leading-8 mt-1"
            >
              <span className="mt-1 ">{selectedGist.owner.login}</span>
              {Object.values(selectedGist.files)[0]?.filename && (
                <>
                  {" / "}
                  <span className="!font-semibold">
                    {Object.values(selectedGist.files)[0]?.filename}
                  </span>
                </>
              )}
            </Typography>
            <Typography variant="body2" className="text-[#7A7A7A]">
              {formatCreatedAt(selectedGist.created_at)}
            </Typography>
            <Typography variant="body2" className="text-[#7A7A7A] mt-1 ">
              {selectedGist.description}
            </Typography>
          </Box>
        </Box>
        <div className="flex gap-2">
          <div className="fork-star-container">
            <Box className={`fork-star-icon-box`}>
              <img src={ForkIcon} className="fork-star-icon" alt="fork-icon" />
              <Typography className="text-[white] !font-semibold !text-[14px]">
                Fork
              </Typography>
            </Box>
            <Box className={`icon-box`}> {selectedGist.forks.length || 0}</Box>
          </div>
          <div className="fork-star-container">
            <Box className={`fork-star-icon-box`}>
              <img
                src={starIcon}
                className="fork-star-icon"
                alt="filled-star"
              />
              <Typography className="text-[white] !font-semibold !text-[14px]">
                Star
              </Typography>
            </Box>
            <Box className={`icon-box`}>0</Box>
          </div>
        </div>
      </div>
      <Box className=" bg-[#f5f5f5] border-b">
        <Typography
          variant="subtitle1"
          className="!text-[14px] !leading-8 mt-1"
        >
          <span className="mt-1 pl-2">
            {Object.values(selectedGist.files)[0]?.filename && (
              <>{Object.values(selectedGist.files)[0]?.filename}</>
            )}
          </span>
        </Typography>
      </Box>
      <Box
        className="p-2 bg-[#f5f5f5] overflow-hidden rounded-t-md flex items-center  flex-col"
        style={{ height: "70vh" }}
      >
        {loading ? (
          <>
            <Skeleton variant="text" width="100%" height="30%" />
            <Skeleton variant="text" width="100%" height="30%" />
            <Skeleton variant="text" width="100%" height="30%" />
            <Skeleton variant="text" width="100%" height="30%" />
          </>
        ) : (
          <pre
            className="text-[12px] leading-[1.4] overflow-auto w-full max-h-full"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {gistContents}
          </pre>
        )}
      </Box>
    </div>
  );
};

export default PublicGistView;
