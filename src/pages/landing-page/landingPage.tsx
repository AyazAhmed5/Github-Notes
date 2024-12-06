import { Box, Typography } from "@mui/material";

import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";

import ListViewGists from "../list-view-gists/listViewGists";
import { useState } from "react";
import CardViewGists from "../card-view-gists/cardViewGists";

const LandingPage = () => {
  const [showGridView, setShowGridView] = useState<boolean>(false);

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
    </div>
  );
};

export default LandingPage;
