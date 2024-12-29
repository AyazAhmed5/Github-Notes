import { useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "../../store/root-reducer";
import { formatTimeAgo } from "../../utilities/utils";
import { Gist } from "../../utilities/types";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router";
import { Box, Typography } from "@mui/material";
import rightIcon from "../../assets/images/righIcon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";

const StarredGistView = () => {
  const navigate = useNavigate();
  const { starredGists } = useSelector((state: RootState) => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const gistsPerPage = 6;

  const totalPages = Math.ceil(starredGists.length / gistsPerPage);

  const indexOfLastGist = currentPage * gistsPerPage;
  const indexOfFirstGist = indexOfLastGist - gistsPerPage;
  const currentGists = starredGists.slice(indexOfFirstGist, indexOfLastGist);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderGistRow = (gist: Gist) => {
    if (!gist) return null;

    return (
      <tr
        key={gist?.id}
        className="border-b hover:bg-gray-50 h-20 cursor-pointer border-l border-r"
        onClick={() => navigate(`/public-gist-view/${gist.id}`)}
      >
        <td className="p-3 flex items-center gap-2">
          <img
            src={gist?.owner?.avatar_url}
            alt="John Doe"
            className="w-10 h-10 rounded-full"
          />
          <span className="table-data">{gist?.owner?.login}</span>
        </td>
        <td className="p-3 table-data">
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
        <td className="p-3 flex items-center justify-center">
          <button className="p-3 rounded-full">
            <StarIcon />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="layout">
      <div className="mb-4 flex justify-between items-center">
        <Typography className="!text-2xl !mb-2">Starred Gists</Typography>
      </div>
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
        <tbody>{currentGists.map(renderGistRow)}</tbody>
      </table>

      <table className="w-full border-collapse rounded-lg">
        <tfoot className={`"bg-gray-100" w-[98%]`}>
          <tr>
            <td colSpan={5} className="p-3">
              <Box className="flex justify-end items-center gap-10">
                <img
                  onClick={() => handlePageChange("prev")}
                  src={leftIcon}
                  alt="Previous Page"
                  className={`${
                    currentPage === 1 ? "opacity-50" : "cursor-pointer"
                  }`}
                />
                <div className="!text-[14px] !font-normal text-[#3D3D3D] flex items-center gap-4">
                  Page
                  <span className="border px-2 py-1 rounded-md">
                    {currentPage}
                  </span>
                  of {totalPages}
                </div>
                <img
                  onClick={() => handlePageChange("next")}
                  src={rightIcon}
                  alt="Next Page"
                  className={`${
                    currentPage === totalPages ? "opacity-50" : "cursor-pointer"
                  }`}
                />
              </Box>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default StarredGistView;
