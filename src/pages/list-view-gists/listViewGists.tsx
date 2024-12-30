import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress, Popover, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import { toast } from "react-toastify";
import { RootState } from "../../store/root-reducer";
import { setStarred } from "../../store/gists/gists.slice";
import { selectIsLoggedIn, setTrigger } from "../../store/user/user.slice";
import { formatTimeAgo } from "../../utilities/utils";
import { Gist } from "../../utilities/types";

import ForkIcon from "../../assets/images/forkIcon.svg";
import starIcon from "../../assets/images/star-icon.svg";
import { useNavigate } from "react-router";
import { forkGist, starGist } from "../../services";

const ListViewGists = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { starredGists } = useSelector((state: RootState) => state.user);
  const { gists, searchedGist, gistLoading, searchQuery } = useSelector(
    (state: RootState) => state.gists
  );
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const noResultFound =
    searchedGist === null && searchQuery && !gistLoading ? true : false;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { fork: boolean; star: boolean };
  }>({});

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

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

  const handleStarClick = async (gistId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [gistId]: { ...prev[gistId], star: true },
    }));
    try {
      const response = await starGist(gistId);
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
      if (error) {
        toast.error("Something Went Wrong ");
        setLoadingStates((prev) => ({
          ...prev,
          [gistId]: { ...prev[gistId], star: false },
        }));
      }
    }
  };

  const renderGistRow = (gist: Gist) => {
    if (!gist) return null;

    const isStarred = starredGists.some(
      (starredGist: Gist) => starredGist.id === gist.id
    );

    return (
      <tr
        key={gist?.id}
        className="border-b hover:bg-gray-50 h-20 cursor-pointer border-l border-r"
        onClick={() => navigate(`/public-gist-view/${gist.id}`)} // Navigate on row click
      >
        <td className="p-3 flex items-center gap-2">
          <img
            src={gist?.owner?.avatar_url}
            alt="John Doe"
            className="w-10 h-10 rounded-full"
          />
          <span className="table-data">{gist?.owner?.login}</span>
        </td>
        <td className="p-3 table-data ]">
          {Object.values(gist?.files)[0]?.filename && (
            <span className="truncate w-[200px] inline-block">
              {Object.values(gist?.files)[0]?.filename}
            </span>
          )}
        </td>
        <td className="p-3">
          <span className="px-5 py-1 bg-[#003B44] text-[11px] font-bold text-white rounded-full table-heading">
            Keyword
          </span>
        </td>
        <td className="p-3 table-data">{formatTimeAgo(gist?.updated_at)}</td>
        <td className="p-3 flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn) {
                handleForkClick(gist.id);
              } else {
                handleClick(e);
              }
            }}
            className="p-3 hover:bg-gray-200 rounded-full"
          >
            {loadingStates[gist?.id]?.fork ? (
              <CircularProgress
                className="!text-[#003B44] fork-star-icon"
                size={20}
              />
            ) : (
              <img src={ForkIcon} className="fork-star-icon" alt="fork-icon" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isLoggedIn) {
                handleStarClick(gist?.id);
              } else {
                handleClick(e);
              }
            }}
            className="p-3 hover:bg-gray-200 rounded-full"
          >
            {loadingStates[gist?.id]?.star ? (
              <CircularProgress
                className="!text-[#003B44] fork-star-icon"
                size={20}
              />
            ) : isStarred && isLoggedIn ? (
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
        </td>
      </tr>
    );
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
  return (
    <div>
      {gistLoading ? (
        <>
          <div className="loading-skeleton-list" />
          <div className="loading-skeleton-list" />
          <div className="loading-skeleton-list" />
          <div className="loading-skeleton-list" />
          <div className="loading-skeleton-list" />
        </>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 table-headings">Name</th>
              <th className="p-3 table-headings">Notebook Name</th>
              <th className="p-3 table-headings">Keyword</th>
              <th className="p-3 table-headings">Updated</th>
              <th className="p-3 table-headings"></th>
            </tr>
          </thead>
          <tbody>
            {searchedGist
              ? renderGistRow(searchedGist)
              : noResultFound
                ? renderSingleRow()
                : gists?.map(renderGistRow)}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListViewGists;
