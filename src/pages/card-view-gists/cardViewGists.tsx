// import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Skeleton,
} from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../store/root-reducer";
import { formatCreatedAt } from "../../utilities/utils";
// import { setLoading } from "../../store/gists/gists.slice";

const CardViewGists = () => {
  const { gists, loading } = useSelector((state: RootState) => state.gists);
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

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mb-3">
      {gists.map((gist) => (
        <Card
          key={gist.id}
          className="w-[380px] h-[280px] max-w-[390px] max-h-[290px] rounded-md shadow-md"
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
          <CardContent className="flex items-start p-4 gap-4">
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
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardViewGists;
