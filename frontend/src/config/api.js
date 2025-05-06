import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
    verify: "/auth/verify/",
    refresh: "/auth/token/refresh/",
  },
  // User endpoints
  users: {
    profile: "/users/profile/",
    update: "/users/profile/update/",
  },
  // Expert endpoints
  experts: {
    list: "/experts/",
    detail: (id) => `/experts/${id}/`,
    create: "/experts/",
    update: (id) => `/experts/${id}/`,
    categories: "/experts/categories/",
    reactions: (id) => `/experts/${id}/reactions/`,
    comments: (id) => `/experts/${id}/comments/`,
  },
  // Podcast endpoints
  podcasts: {
    list: "/podcasts/",
    detail: (id) => `/podcasts/${id}/`,
    create: "/podcasts/create/",
    update: (id) => `/podcasts/${id}/update/`,
    categories: "/podcasts/categories/",
    likes: (id) => `/podcasts/${id}/likes/`,
    comments: (id) => `/podcasts/${id}/comments/`,
  },
  // Message endpoints
  messages: {
    list: "/messages/",
    send: "/messages/send/",
    conversation: (userId) => `/messages/conversation/${userId}/`,
  },
  // Bookmark endpoints
  bookmarks: {
    list: "/bookmarks/",
    add: "/bookmarks/add/",
    remove: "/bookmarks/remove/",
  },
};

export default api;
