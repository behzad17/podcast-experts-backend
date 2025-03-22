import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject(new Error("No refresh token available"));
      }

      return api
        .post("/users/token/refresh/", {
          refresh: refreshToken,
        })
        .then((response) => {
          const { access } = response.data;
          localStorage.setItem("token", access);
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
          return api(originalRequest);
        })
        .catch((refreshError) => {
          // If refresh fails, only clear data if we're not on the login page
          if (!window.location.pathname.includes("/login")) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        });
    }

    // For other errors, don't clear auth data
    return Promise.reject(error);
  }
);

export default api;
