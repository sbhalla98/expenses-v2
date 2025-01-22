import axios from "axios";

// Function to get userId from localStorage
const getUserId = () => {
  try {
    const config = localStorage.getItem("config");
    if (config) {
      const parsedConfig = JSON.parse(config);
      if (parsedConfig?.state?.userId) {
        return parsedConfig.state.userId;
      }
    }
  } catch (error) {
    console.error("Error retrieving userId from localStorage:", error);
  }
  // Fallback userId if not found or an error occurs
  return "9876";
};

const apiClient = axios.create({});

// Add a request interceptor to include the userId in headers
apiClient.interceptors.request.use((config) => {
  config.headers["user-id"] = getUserId();
  return config;
});

export default apiClient;
