import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
  (error) => {
    // Only redirect to login for protected routes that return 401
    if (error.response?.status === 401) {
      const isPublicRoute = publicRoutes.some((route) =>
        error.config.url.includes(route)
      );

      if (!isPublicRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
