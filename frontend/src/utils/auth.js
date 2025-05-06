export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getUserType = () => {
  return localStorage.getItem("userType");
};

export const setAuthData = (data) => {
  localStorage.setItem("token", data.access);
  localStorage.setItem("refresh", data.refresh);
  localStorage.setItem("userType", data.user_type);
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("userType");
};
