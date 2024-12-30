import apiClient from "../../utilities/api-client";
import { Gist } from "../../utilities/types";

export const fetchGistsByUser = async (
  username: string,
  page?: number,
  perPage?: number
): Promise<Gist[] | null> => {
  if (!username) {
    console.error("Username is required to fetch gists.");
    return null;
  }

  try {
    let url = `/users/${username}/gists`;
    url += `?t=${new Date().getTime()}`;
    if (page !== undefined && perPage !== undefined) {
      url += `&page=${page}&per_page=${perPage}`;
    }

    const response = await apiClient.get(url);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error fetching gists: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching gists:", error);
    return null;
  }
};
