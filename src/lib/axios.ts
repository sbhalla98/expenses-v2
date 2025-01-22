import axios from "axios";

// Get userId (example: from environment variables, cookies, or session)
const getUserId = () => {
  // Replace this with your logic to fetch the userId
  return localStorage.getItem("userId") || "9876";
};

const apiClient = axios.create({});

// Add a request interceptor to include the userId in headers
apiClient.interceptors.request.use((config) => {
  config.headers["user-id"] = getUserId();
  return config;
});

export default apiClient;
