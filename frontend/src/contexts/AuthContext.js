import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          try {
            const response = await axios.get(
              "http://localhost:8002/api/users/me/"
            );
            setUser(response.data);
            setIsAuthenticated(true);
          } catch (error) {
            // If token is invalid, clear everything
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.removeItem("userType");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8002/api/users/login/",
        {
          username,
          password,
        }
      );

      if (response.data.access && response.data.user) {
        const { access: token, user: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userType", userData.user_type);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw { message: "Invalid username or password" };
      } else if (error.response?.status === 403) {
        throw { message: "Please verify your email before logging in" };
      } else {
        throw { message: "Login failed. Please try again." };
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8002/api/users/register/",
        userData
      );
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { message: "Registration failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
