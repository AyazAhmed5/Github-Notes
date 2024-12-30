import apiClient from "../../utilities/api-client";

export const starGist = async (
  gistId: string
): Promise<{ message: string } | null> => {
  try {
    const response = await apiClient.put(`/gists/${gistId}/star`, null, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status === 204) {
      return { message: "Gist starred successfully" };
    } else {
      throw new Error("Failed to star the gist");
    }
  } catch (error) {
    console.error("Error starring gist:", error);
    return null;
  }
};
