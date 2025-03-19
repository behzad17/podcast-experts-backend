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
        setUser(response.data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log("Attempting login with username:", username);
      const response = await axios.post(
        "http://localhost:8000/api/users/login/",
        {
          username,
          password,
        }
      );
      console.log("Login response:", response.data);

      if (response.data.access && response.data.user) {
        const { access: token, user: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));
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
    delete axios.defaults.headers.common["Authorization"];
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
