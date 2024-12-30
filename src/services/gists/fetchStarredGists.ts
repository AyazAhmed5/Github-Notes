import apiClient from "../../utilities/api-client";
import { Gist } from "../../utilities/types";

export const fetchStarredGists = async (): Promise<Gist[]> => {
  try {
    const response = await apiClient.get("/gists/starred", {
      params: {
        t: new Date().getTime(),
        per_page: 100,
      },
    });

    return response.data as Gist[];
  } catch (error) {
    console.error("Error fetching starred gists:", error);
    return [];
  }
};
