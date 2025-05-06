import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          try {
            // Verify token with backend
            await axios.get("/users/verify-token/");
            setUser(JSON.parse(userData));
          } catch (error) {
            // If token verification fails, clear everything
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/users/login/", {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("userType", user.user_type);
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          return {
            success: false,
            error: "Invalid username or password",
          };
        }
        return {
          success: false,
          error: error.response.data.detail || "Login failed",
        };
      }
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/users/register/", userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "Registration failed",
        };
      }
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    setUser(null);
    navigate("/");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
