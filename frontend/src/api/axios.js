import axios from "axios";

const api = axios.create({
  baseURL: "https://podcast-backend-4e5439705bd3.herokuapp.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// List of public routes that don't require authentication
const publicRoutes = [
  "/podcasts/podcasts/featured/",
  "/experts/profiles/featured/",
  "/experts/",
  "/podcasts/",
  "/experts/categories/",
  "/users/login/",
  "/users/register/",
  "/users/verify-email/",
  "/users/verify-token/",
  "/users/token/refresh/",
];

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
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isPublicRoute = publicRoutes.some((route) =>
        error.config.url.includes(route)
      );

      if (isPublicRoute) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Use the same axios instance for the refresh request
        const response = await api.post("/users/token/refresh/", {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("token", access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Only clear auth data and redirect if it's not a refresh token request
        if (!originalRequest.url.includes("/users/token/refresh/")) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
          localStorage.removeItem("userType");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
