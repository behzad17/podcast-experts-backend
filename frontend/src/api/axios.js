import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3005",
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request details for debugging
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - please check if the server is running");
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        config: error.config,
      });
    } else if (error.response) {
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
