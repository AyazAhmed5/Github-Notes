/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Gist, GistFile, publicGistInterface } from "./types";
import apiClient from "./api-client";

export const LoginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("gist");

  try {
    const result: any = await signInWithPopup(auth, provider);

    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;

    if (token) {
      localStorage.setItem("GITHUB_TOKEN", token);
    }

    const user = result.user;
    const screenName = user.reloadUserInfo?.screenName;

    return { user, token, screenName };
  } catch (error) {
    console.error("Error during GitHub login:", error);
    throw error;
  }
};

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

export const fetchUserProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/user");

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

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

export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const updatedAt = new Date(timestamp);

  const seconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `Last updated ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `Last updated ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `Last updated ${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    return `Last updated ${days} day${days !== 1 ? "s" : ""} ago`;
  }
};

export const formatCreatedAt = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);

  const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `Created ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `Created ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `Created ${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    return `Created ${days} day${days !== 1 ? "s" : ""} ago`;
  }
};
