import { useState } from "react";
import deleteIcon from "../../assets/images/delete-icon.svg";
import { Box } from "@mui/material";
import { createGist } from "../../utilities/utils";
import { toast } from "react-toastify";
import { RootState } from "../../store/root-reducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setTrigger } from "../../store/user/user.slice";

const CreateGists = () => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState<{ name: string; content: string }[]>([
    { name: "", content: "" },
  ]);
  const handleAddFile = () => {
    setFiles([...files, { name: "", content: "" }]);
  };

  const handleFileChange = (
    index: number,
    field: "name" | "content",
    value: string
  ) => {
    const updatedFiles = [...files];
    updatedFiles[index][field] = value;
    setFiles(updatedFiles);
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleCreateGist = async () => {
    if (!description) {
      toast.warn("Please enter a description.");

      return;
    }
    if (!user.token) {
      toast.warn("Please Login First in order to Create A gist");
      return;
    }
    if (
      files.length === 0 ||
      files.some((file) => !file.name || !file.content)
    ) {
      toast.warn("Please make sure you have both filename and filecontent");
      return;
    }

    const filesPayload: Record<string, { content: string }> = {};
    files.forEach((file) => {
      filesPayload[file.name] = { content: file.content };
    });

    try {
      const newGist = await createGist(description, filesPayload, user.token);

      if (newGist) {
        toast.success("Gist Created Successfully!🚀");
        dispatch(setTrigger());
        setDescription("");
        setFiles([{ name: "", content: "" }]);
        navigate("/user-profile");
      } else {
        toast.error("Something Went Wrong!");
      }
    } catch (error) {
      console.error("Error creating gist:", error);
      toast.error("An error occurred while creating the gist.");
    }
  };

  return (
    <div className="layout !mt-10">
      <h1 className="!text-[25px] !text-[#3D3D3D] !leading-7 ">Create Gist</h1>
      <div className="max-w-screen-md mx-auto mt-3 p-5 ">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Gist description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-900"
          />
        </div>

        {files.map((file, index) => (
          <div key={index} className="border border-gray-300 ">
            <div className="flex flex-col gap-2 items-start w-full bg-gray-100 ">
              <Box className="flex w-[50%] ">
                <input
                  type="text"
                  value={file.name}
                  onChange={(e) =>
                    handleFileChange(index, "name", e.target.value)
                  }
                  placeholder="Filename including extension..."
                  className="w-full m-2 p-3 border border-gray-400 rounded-sm bg-gray-100 focus:outline-none focus:ring-1 focus:ring-green-900"
                />

                <img
                  onClick={() => handleDeleteFile(index)}
                  className={`h-5 w-5 text-red-500 ${file.name === "" ? "hidden" : ""} cursor-pointer self-center`}
                  src={deleteIcon}
                  alt="delete-icon"
                />
              </Box>

              <textarea
                value={file.content}
                onChange={(e) =>
                  handleFileChange(index, "content", e.target.value)
                }
                rows={8}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-900"
              />
            </div>
          </div>
        ))}

        <div className=" mt-4 flex justify-between">
          <button
            onClick={handleAddFile}
            className="px-5 py-1 bg-[#EFEFEF] text-[#003B44] font-semibold rounded-sm shadow focus:outline-none"
          >
            Add File
          </button>

          <button
            onClick={handleCreateGist}
            className="px-5 py-1 bg-[#003B44] text-white rounded-sm shadow focus:outline-none "
          >
            Create Gist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGists;
