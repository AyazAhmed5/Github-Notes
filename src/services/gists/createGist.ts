import apiClient from "../../utilities/api-client";
import { Gist } from "../../utilities/types";

export const createGist = async (
  description: string,
  files: Record<string, { content: string }>
): Promise<Gist | null> => {
  if (!description || Object.keys(files).length === 0) {
    return null;
  }

  try {
    const response = await apiClient.post("/gists", {
      description,
      files,
      public: true,
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Error creating gist: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error creating gist:", error);
    return null;
  }
};
