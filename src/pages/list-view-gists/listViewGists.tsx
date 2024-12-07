import ForkIcon from "../../assets/images/forkIcon.svg";
import StarIcon from "../../assets/images/star-icon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";
import rightIcon from "../../assets/images/righIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { useEffect } from "react";
import { formatTimeAgo, getPublicGists } from "../../utilities/utils";
import { setGists, setPage } from "../../store/gists/gists.slice";
import { Box } from "@mui/material";

const ListViewGists = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { gists, page } = useSelector((state: RootState) => state.gists);
  console.log("🚀 ~ ListViewGists ~ page:", page);

  useEffect(() => {
    const fetchGists = async () => {
      const data = await getPublicGists(page, 6);
      if (data) dispatch(setGists(data));
    };

    fetchGists();
  }, [dispatch, user.token]);

  const handlePreviousPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    dispatch(setPage(page + 1));
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
          {gists.map((gist) => (
            <tr className="border-b hover:bg-gray-50 cursor-pointer">
              <td className="p-3 flex items-center gap-2">
                <img
                  src={gist.owner.avatar_url}
                  alt="John Doe"
                  className="w-10 h-10 rounded-full"
                />
                <span className="table-data">{gist.owner.login}</span>
              </td>
              <td className="p-3 table-data">Notebook Name</td>
              <td className="p-3">
                <span className="px-5 py-1 bg-[#003B44] text-[11px] font-bold text-white rounded-full table-heading">
                  Keyword
                </span>
              </td>
              <td className="p-3 table-data">
                {formatTimeAgo(gist.updated_at)}
              </td>
              <td className="p-3 flex items-center justify-end">
                <button className="p-3 hover:bg-gray-200 rounded-full">
                  <img
                    src={ForkIcon}
                    className="fork-star-icon"
                    alt="fork-icon "
                  />
                </button>
                <button className="p-3 hover:bg-gray-200 rounded-full">
                  <img
                    src={StarIcon}
                    className="fork-star-icon"
                    alt="fork-icon "
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100">
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
                  of 14
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
    </div>
  );
};

export default ListViewGists;
