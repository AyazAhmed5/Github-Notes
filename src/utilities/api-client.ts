import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("GITHUB_TOKEN");
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});

export default apiClient;
