/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";

// The exported login function that includes the handleLogin logic
export const LoginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("gist");

  try {
    const result: any = await signInWithPopup(auth, provider);

    const user = result.user;
    const token = result.user.accesstoken;
    return { user, token };
  } catch (error) {
    console.error("Error during GitHub login:", error);
    throw error;
  }
};
