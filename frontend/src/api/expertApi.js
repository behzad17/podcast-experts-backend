import api from "./axios";

export const expertApi = {
  // Get all experts
  getAllExperts: (params) => api.get("/experts/", { params }),

  // Get a single expert
  getExpert: (id) => api.get(`/experts/${id}/`),

  // Create a new expert profile
  createExpertProfile: (data) => api.post("/experts/create/", data),

  // Update an expert profile
  updateExpertProfile: (id, data) => api.put(`/experts/${id}/`, data),

  // Delete an expert profile
  deleteExpertProfile: (id) => api.delete(`/experts/${id}/`),

  // Get expert comments
  getComments: (expertId) => api.get(`/experts/profiles/${expertId}/comments/`),

  // Add a comment
  addComment: (expertId, data) =>
    api.post(`/experts/profiles/${expertId}/comments/`, data),

  // Get expert reactions
  getReactions: (expertId) =>
    api.get(`/experts/profiles/${expertId}/reactions/`),

  // Add/update a reaction
  addReaction: (expertId, data) =>
    api.post(`/experts/profiles/${expertId}/reactions/`, data),

  // Delete a reaction
  deleteReaction: (expertId, reactionId) =>
    api.delete(`/experts/profiles/${expertId}/reactions/${reactionId}/`),

  // Get expert categories
  getCategories: () => api.get("/experts/categories/"),

  // Get my expert profile
  getMyProfile: () => api.get("/experts/my-profile/"),

  // Get expert stats
  getStats: () => api.get("/experts/stats/"),
};
