import apiClient from "../../utilities/api-client";
import { GistFile } from "../../utilities/types";

export const fetchGistDetails = async (gistId: string) => {
  try {
    const response = await apiClient.get(`/gists/${gistId}`);

    const files = Object.entries(response.data.files).map(
      ([filename, file]) => ({
        filename,
        content: (file as GistFile).content || "No Content Available",
      })
    );

    return files;
  } catch (error) {
    console.error("Error fetching gist details:", error);
    return [];
  }
};
