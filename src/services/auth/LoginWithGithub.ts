import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

export const LoginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("gist");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
