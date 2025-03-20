import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
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
  async (error) => {
    if (error.response?.status === 401) {
      // فقط در صورتی که در صفحه لاگین نباشیم، به صفحه لاگین هدایت کنیم
      if (!window.location.pathname.includes("/login")) {
        // Store the current URL before redirecting
        const currentPath = window.location.pathname;
        localStorage.setItem("redirectAfterLogin", currentPath);

        // Remove token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
