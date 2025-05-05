import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response from:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const login = (credentials) => api.post("/users/login/", credentials);
export const register = (userData) => api.post("/users/register/", userData);
export const getProfile = () => api.get("/users/profile/");

// Podcast endpoints
export const getPodcasts = async () => {
  try {
    console.log("Making request to /podcasts/");
    const response = await api.get("/podcasts/");
    console.log("Podcasts response data:", response.data);
    return response;
  } catch (error) {
    console.error("Error in getPodcasts:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const getFeaturedPodcasts = () => api.get("/podcasts/featured/");
export const getPodcast = (id) => api.get(`/podcasts/${id}/`);
export const likePodcast = (id) => api.post(`/podcasts/${id}/like/`);
export const unlikePodcast = (id) => api.delete(`/podcasts/${id}/like/`);

// Podcaster profile endpoints
export const getPodcasterProfile = () => api.get("/podcasts/profiles/me/");
export const createPodcasterProfile = (data) =>
  api.post("/podcasts/profiles/", data);
export const getMyPodcasts = () => api.get("/podcasts/my-podcasts/");

// Expert endpoints
export const getExperts = () => api.get("/experts/");
export const getFeaturedExperts = () => api.get("/experts/featured/");
export const getExpert = (id) => api.get(`/experts/${id}/`);
export const likeExpert = (id) =>
  api.post(`/experts/profiles/${id}/react/`, { reaction_type: "like" });
export const unlikeExpert = (id) =>
  api.post(`/experts/profiles/${id}/react/`, { reaction_type: "like" });

// User endpoints
export const getUsers = () => api.get("/users/");
export const sendMessage = (receiver_id, content) =>
  api.post("/messages/", { receiver_id, content });

export { api };
