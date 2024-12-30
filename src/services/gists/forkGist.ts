import apiClient from "../../utilities/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const forkGist = async (gistId: string): Promise<any | null> => {
  try {
    const response = await apiClient.post(`/gists/${gistId}/forks`, null, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Failed to fork the gist");
    }
  } catch (error) {
    console.error("Error forking gist:", error);
    return null;
  }
};
