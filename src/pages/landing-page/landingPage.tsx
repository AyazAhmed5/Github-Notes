import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Typography } from "@mui/material";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";

import { RootState } from "../../store/root-reducer";
import { setGists, setPage } from "../../store/gists/gists.slice";
import { getPublicGists } from "../../utilities/utils";
import CardViewGists from "../card-view-gists/cardViewGists";
import ListViewGists from "../list-view-gists/listViewGists";
import rightIcon from "../../assets/images/righIcon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { page, searchedGist } = useSelector((state: RootState) => state.gists);
  const { user } = useSelector((state: RootState) => state.user);

  const [showGridView, setShowGridView] = useState<boolean>(false);

  useEffect(() => {
    const fetchGists = async () => {
      const data = await getPublicGists(page, 6, user.token);
      if (data) dispatch(setGists(data));
    };

    fetchGists();
  }, [dispatch, page, user.token]);

  const handlePreviousPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    dispatch(setPage(page + 1));
  };

  return (
    <div className="layout">
      <div className="mb-4 flex justify-between items-center">
        <Typography className="!text-2xl !mb-2">Public Gists</Typography>
        <div className="filters-container">
          <Box
            className={`icon-box ${!showGridView ? "" : " bg-[#E3E3E3]"}  cursor-pointer`}
            onClick={() => setShowGridView(true)}
          >
            <SpaceDashboardOutlinedIcon
              sx={{
                color: "grey.500",
                width: "24px",
                height: "24px",
              }}
            />
          </Box>
          <Box
            className={`icon-box ${showGridView ? "" : " bg-[#E3E3E3]"}  cursor-pointer`}
            onClick={() => setShowGridView(false)}
          >
            <FormatListBulletedOutlinedIcon
              sx={{
                color: "grey.500",
                width: "24px",
                height: "24px",
              }}
            />
          </Box>
        </div>
      </div>
      {showGridView ? <CardViewGists /> : <ListViewGists />}

      {/*Table Footer */}
      <table className="w-full border-collapse rounded-lg">
        <tfoot className="bg-gray-100 w-[98%]">
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
                  <span className="border px-2 py-1 rounded-md">
                    {searchedGist ? "1" : page}
                  </span>
                  of {searchedGist ? "1" : "500"}
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

export default LandingPage;
