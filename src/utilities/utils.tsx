import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseConfig";

// The exported login function that includes the handleLogin logic
export const LoginWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope("gist");

  try {
    const result = await signInWithPopup(auth, provider);

    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    const user = result.user;
    return { user, token };
  } catch (error) {
    console.error("Error during GitHub login:", error);
    throw error;
  }
};
