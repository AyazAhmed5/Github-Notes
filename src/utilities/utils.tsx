/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { publicGistInterface } from "./types";

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

export const getPublicGists = async (
  page: number,
  count: number
): Promise<publicGistInterface[] | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/gists/public?page=${page}&per_page=${count}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
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
