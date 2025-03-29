import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
      if (token) {
        const response = await axios.get(
          "http://localhost:8000/api/users/me/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userType", userData.user_type);
      } else {
        localStorage.removeItem("userData");
        localStorage.removeItem("userType");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userType");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email });
      const response = await axios.post(
        "http://localhost:8000/api/users/login/",
        {
          email,
          password,
        }
      );
      console.log("Login response:", response.data);

      if (response.data.access && response.data.user) {
        const { access: token, user: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userType", userData.user_type);
        setUser(userData);

        // Set default authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return userData;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        throw { message: "Invalid email or password" };
      } else if (error.response?.status === 403) {
        throw { message: "Please verify your email before logging in" };
      } else if (error.response?.data) {
        throw error.response.data;
      } else {
        throw { message: "Login failed. Please try again." };
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register/",
        userData
      );
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
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
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
    login,
    register,
    logout,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
