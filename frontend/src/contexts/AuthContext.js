import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (token && refreshToken) {
        // Set initial user data from localStorage
        if (userData) {
          setUser(userData);
        }

        try {
          // Try to get fresh user data
          const response = await api.get("/users/me/");
          setUser(response.data);
        } catch (error) {
          if (error.response?.status === 401) {
            // Token expired, try to refresh
            try {
              const refreshResponse = await api.post("/users/token/refresh/", {
                refresh: refreshToken,
              });

              const { access } = refreshResponse.data;
              localStorage.setItem("token", access);

              // Retry getting user data
              const userResponse = await api.get("/users/me/");
              setUser(userResponse.data);
            } catch (refreshError) {
              // If refresh fails, clear everything and set user to null
              console.error("Token refresh failed:", refreshError);
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("userData");
              setUser(null);
            }
          } else {
            // If it's not a 401 error, keep the user logged in with stored data
            console.error("Error fetching user data:", error);
            if (userData) {
              setUser(userData);
            }
          }
        }
      } else {
        // If no tokens, clear everything and set user to null
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't clear data on general errors, try to keep the user logged in
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        setUser(userData);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log("Attempting login with username:", username);
      const response = await api.post("/users/login/", {
        username,
        password,
      });
      console.log("Login response:", response.data);

      if (response.data.access && response.data.user) {
        const {
          access: token,
          refresh: refreshToken,
          user: userData,
        } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);

        return userData;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password");
      } else if (error.response?.status === 403) {
        throw new Error("Please verify your email before logging in");
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response?.data) {
        throw new Error(Object.values(error.response.data)[0]);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please try again");
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/users/register/", userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw { message: "Registration failed. Please try again." };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
