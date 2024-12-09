/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Gist, publicGistInterface } from "./types";

export const LoginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("gist");

  try {
    const result: any = await signInWithPopup(auth, provider);

    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential!.accessToken;

    const user = result.user;
    return { user, token };
  } catch (error) {
    console.error("Error during GitHub login:", error);
    throw error;
  }
};

export const fetchGistById = async (
  gistId: string,
  token: string | null
): Promise<Gist | null> => {
  if (!gistId) return null;

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "GET",
      headers: {
        Authorization: token ? `token ${token}` : "",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching gist: ${response.statusText}`);
    }

    const gist = await response.json();

    if (gist) {
      return gist;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching gist:", error);
    return null;
  }
};

export const createGist = async (
  description: string,
  files: Record<string, { content: string }>,
  token: string | null
): Promise<Gist | null> => {
  if (!description || Object.keys(files).length === 0) {
    return null;
  }

  try {
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: token ? `token ${token}` : "",
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        files,
        public: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating gist: ${response.statusText}`);
    }

    const newGist = await response.json();
    return newGist;
  } catch (error) {
    console.error("Error creating gist:", error);
    return null;
  }
};

export const forkGist = async (gistId: string, token: string) => {
  try {
    const response = await fetch(
      `https://api.github.com/gists/${gistId}/forks`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${token}`, // The OAuth token for the authenticated user
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fork the gist");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error forking gist");
  }
};

export const starGist = async (gistId: string, token: string) => {
  try {
    const response = await fetch(
      `https://api.github.com/gists/${gistId}/star`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to star the gist");
    }

    return { message: "Gist starred successfully" }; // Custom message
  } catch (error) {
    console.error(error);
    throw new Error("Error starring gist");
  }
};

export const fetchStarredGists = async (
  token: string | null
): Promise<Gist[]> => {
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.github.com/gists/starred?${new Date().getTime()}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch starred gists");
    }

    const data: Gist[] = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};

export const fetchUserProfile = async (token: string) => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  const userData = await response.json();

  return userData.html_url;
};

export const getPublicGists = async (
  page: number,
  count: number,
  token: string | null
): Promise<publicGistInterface[] | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/gists/public?page=${page}&per_page=${count}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: token ? `token ${token}` : "",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
};

export const fetchGistDetails = async (
  gistId: string,
  token: string | null
) => {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const file = data.files[Object.keys(data.files)[0]];
    return file?.content;
  } catch (error) {
    console.log(error);
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
