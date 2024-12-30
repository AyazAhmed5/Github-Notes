import apiClient from "../../utilities/api-client";

export const fetchGistById = async (gistId: string) => {
  if (!gistId) return null;

  try {
    const response = await apiClient.get(`/gists/${gistId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching gist: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching gist:", error);
    return null;
  }
};
