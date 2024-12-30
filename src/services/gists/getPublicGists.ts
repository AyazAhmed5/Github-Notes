import apiClient from "../../utilities/api-client";
import { publicGistInterface } from "../../utilities/types";

export const getPublicGists = async (
  page: number,
  count: number
): Promise<publicGistInterface[] | null> => {
  try {
    const response = await apiClient.get("/gists/public", {
      params: {
        page,
        per_page: count,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching public gists:", error);
    return null;
  }
};
