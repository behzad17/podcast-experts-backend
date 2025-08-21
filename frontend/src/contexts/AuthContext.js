import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
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
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("🔐 Initializing auth...", { 
          hasToken: !!token, 
          hasUserData: !!userData, 
          hasRefreshToken: !!refreshToken 
        });

        if (token && userData && refreshToken) {
          try {
            // Verify token by getting current user data
            console.log("🔍 Verifying token with /users/me/...");
            const response = await api.get("/users/me/");
            console.log("✅ Token verified, user data:", response.data);
            setUser(response.data);
          } catch (error) {
            console.log("❌ Token verification failed:", error.response?.status);
            if (error.response?.status === 401) {
              try {
                console.log("🔄 Attempting token refresh...");
                // Try to refresh the token
                const response = await api.post("/users/token/refresh/", {
                  refresh: refreshToken,
                });
                const { access } = response.data;
                localStorage.setItem("token", access);
                console.log("✅ Token refreshed successfully");
                
                // After successful refresh, get user data again
                const userResponse = await api.get("/users/me/");
                setUser(userResponse.data);
                localStorage.setItem("userData", JSON.stringify(userResponse.data));
                console.log("✅ User data restored after refresh");
              } catch (refreshError) {
                console.log("❌ Token refresh failed, clearing auth data");
                // If refresh fails, clear everything
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userData");
                localStorage.removeItem("userType");
                setUser(null);
              }
            } else {
              console.log("❌ Other error, clearing auth data");
              // For other errors, clear everything
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("userData");
              localStorage.removeItem("userType");
              setUser(null);
            }
          }
        } else {
          console.log("❌ Missing auth data, setting user to null");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("🔐 Auth initialization complete");
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      console.log("🔐 Attempting login for:", username);
      const response = await api.post("/users/login/", {
        username,
        password,
      });

      const { access, refresh, user } = response.data;
      console.log("✅ Login successful, storing tokens and user data");

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("userType", user.user_type);
      setUser(user);

      console.log("✅ Auth state updated, user logged in");
      return { success: true };
    } catch (error) {
      console.error("❌ Login error:", error);
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
      const response = await api.post("/users/register/", userData);
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
    localStorage.removeItem("refreshToken");
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
