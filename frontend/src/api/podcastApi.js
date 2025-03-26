import api from "./axios";

export const podcastApi = {
  // Get all podcasts
  getAllPodcasts: (params) => api.get("/podcasts/", { params }),

  // Get a single podcast
  getPodcast: (id) => api.get(`/podcasts/${id}/`),

  // Create a new podcast
  createPodcast: (data) => api.post("/podcasts/", data),

  // Update a podcast
  updatePodcast: (id, data) => api.put(`/podcasts/${id}/`, data),

  // Delete a podcast
  deletePodcast: (id) => api.delete(`/podcasts/${id}/`),

  // Get podcast comments
  getComments: (podcastId) => api.get(`/podcasts/${podcastId}/comments/`),

  // Add a comment
  addComment: (podcastId, data) =>
    api.post(`/podcasts/${podcastId}/comments/`, data),

  // Get podcast reactions
  getReactions: (podcastId) => api.get(`/podcasts/${podcastId}/reactions/`),

  // Add/update a reaction
  addReaction: (podcastId, data) =>
    api.post(`/podcasts/${podcastId}/reactions/`, data),

  // Delete a reaction
  deleteReaction: (podcastId, reactionId) =>
    api.delete(`/podcasts/${podcastId}/reactions/${reactionId}/`),

  // Get podcast categories
  getCategories: () => api.get("/podcasts/categories/"),
};
