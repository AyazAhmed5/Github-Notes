import apiClient from "../../utilities/api-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchUserProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/user");

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
