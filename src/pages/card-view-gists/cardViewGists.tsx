import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import leftIcon from "../../assets/images/leftIcon.svg";
import rightIcon from "../../assets/images/righIcon.svg";
import { RootState } from "../../store/root-reducer";
import { fetchGistDetails, formatCreatedAt } from "../../utilities/utils";
import { setLoading, setPage } from "../../store/gists/gists.slice";

const CardViewGists = () => {
  const { gists, loading, page } = useSelector(
    (state: RootState) => state.gists
  );
  const dispatch = useDispatch();
  const [gistContents, setGistContents] = useState<{ [key: string]: string }>(
    {}
  );
  useEffect(() => {
    const fetchContents = async () => {
      dispatch(setLoading(true));
      const contents: { [key: string]: string } = {};
      for (const gist of gists) {
        const content = await fetchGistDetails(gist.id);
        contents[gist.id] = content;
      }
      setGistContents(contents);
      dispatch(setLoading(false));
    };

    if (gists.length > 0) {
      fetchContents();
    }
  }, [dispatch, gists]);

  const handlePreviousPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNextPage = () => {
    dispatch(setPage(page + 1));
  };

  return (
    <div className="flex justify-start items-center flex-wrap gap-4">
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
                {gistContents[gist.id]
                  ? gistContents[gist.id].slice(0, 200) + "..." // Show the first 200 characters and add "..."
                  : "No preview available"}
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
      <table className="w-full border-collapse">
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

export default CardViewGists;
