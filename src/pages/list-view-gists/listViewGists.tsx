/* eslint-disable @typescript-eslint/no-explicit-any */
import ForkIcon from "../../assets/images/forkIcon.svg";
import starIcon from "../../assets/images/star-icon.svg";
import StarIcon from "@mui/icons-material/Star";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import {
  fetchGistById,
  forkGist,
  formatTimeAgo,
  starGist,
} from "../../utilities/utils";
import { toast } from "react-toastify";
import { CircularProgress, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { setStarred } from "../../store/gists/gists.slice";
import { Gist } from "../../utilities/types";
import { setTrigger } from "../../store/user/user.slice";

const ListViewGists = () => {
  const { gists, searchQuery } = useSelector((state: RootState) => state.gists);
  const dispatch = useDispatch();
  const { user, starredGists } = useSelector((state: RootState) => state.user);

  const [filteredGist, setFilteredGist] = useState<Gist | null>();

  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { fork: boolean; star: boolean };
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchGist = async () => {
      const gist = await fetchGistById(searchQuery, user?.token); // Make sure to pass the token if needed
      if (gist) {
        setFilteredGist(gist);
        setLoading(false);
      } else {
        setFilteredGist(null);
      }
    };
    if (searchQuery) {
      setLoading(true);
      fetchGist();
    } else {
      setLoading(false);
    }
  }, [gists, searchQuery, user?.token]);

  const renderGistRow = (gist: Gist) => {
    if (!gist) return null;

    const isStarred = starredGists.some(
      (starredGist: Gist) => starredGist.id === gist.id
    );

    return (
      <tr
        key={gist.id}
        className="border-b hover:bg-gray-50 cursor-pointer border-l border-r"
      >
        <td className="p-3 flex items-center gap-2">
          <img
            src={gist.owner.avatar_url}
            alt="John Doe"
            className="w-10 h-10 rounded-full"
          />
          <span className="table-data">{gist.owner.login}</span>
        </td>
        <td className="p-3 table-data ]">
          {Object.values(gist.files)[0]?.filename && (
            <span className="truncate w-[200px] inline-block">
              {Object.values(gist.files)[0]?.filename}
            </span>
          )}
        </td>
        <td className="p-3">
          <span className="px-5 py-1 bg-[#003B44] text-[11px] font-bold text-white rounded-full table-heading">
            Keyword
          </span>
        </td>
        <td className="p-3 table-data">{formatTimeAgo(gist.updated_at)}</td>
        <td className="p-3 flex items-center justify-end">
          <button
            onClick={() => handleForkClick(gist.id, user?.token)}
            className="p-3 hover:bg-gray-200 rounded-full"
          >
            {loadingStates[gist.id]?.fork ? (
              <CircularProgress className="!text-[#003B44]" size={20} />
            ) : (
              <img src={ForkIcon} className="fork-star-icon" alt="fork-icon" />
            )}
          </button>
          <button
            onClick={() => handleStarClick(gist.id, user?.token)}
            className="p-3 hover:bg-gray-200 rounded-full"
          >
            {loadingStates[gist.id]?.star ? (
              <CircularProgress className="!text-[#003B44]" size={20} />
            ) : isStarred ? (
              <StarIcon />
            ) : (
              <img
                src={starIcon}
                className="fork-star-icon"
                alt="filled-star"
              />
            )}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div>
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
          {loading ? (
            <tr className="border-b hover:bg-gray-50 cursor-pointer border-l border-r">
              <Skeleton variant="text" width="400%" height="30%" />
              <Skeleton variant="text" width="500%" height="30%" />
              <Skeleton variant="text" width="600%" height="30%" />
            </tr>
          ) : filteredGist ? (
            renderGistRow(filteredGist)
          ) : (
            gists?.map(renderGistRow)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListViewGists;
