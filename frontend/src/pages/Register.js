import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "podcaster",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    // Basic validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending registration request:", formData);
      const response = await api.post("/users/register/", formData);
      console.log("Registration response:", response.data);
      setSuccess(true);
      // Store user type for later use
      localStorage.setItem("userType", formData.user_type);
      setTimeout(() => {
        navigate("/login");
      }, 10000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        // Handle specific error messages from the backend
        if (typeof error.response.data === "object") {
          const errorMessages = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
          setError(errorMessages);
        } else {
          setError(
            error.response.data.detail ||
              "Registration failed. Please try again."
          );
        }
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.message.includes("Network Error")) {
        setError(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 0",
      }}
    >
      <Container
        style={{
          maxWidth: "500px",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            color: "#455a64",
            fontWeight: "600",
            fontSize: "2rem",
          }}
        >
          Create Account
        </h2>
        {error && (
          <Alert
            variant="danger"
            style={{
              backgroundColor: "#ffebee",
              borderColor: "#ffcdd2",
              color: "#c62828",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            variant="success"
            style={{
              backgroundColor: "#e8f5e9",
              borderColor: "#c8e6c9",
              color: "#2e7d32",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          >
            Registration successful! Please check your email for verification.
            You will be redirected to the login page in 10 seconds. If you don't
            see the verification email, please check your spam folder.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                color: "#455a64",
                fontWeight: "500",
                marginBottom: "0.5rem",
              }}
            >
              Username
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                transition: "border-color 0.2s ease",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label
              style={{
                color: "#455a64",
                fontWeight: "500",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                transition: "border-color 0.2s ease",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label
              style={{
                color: "#455a64",
                fontWeight: "500",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                transition: "border-color 0.2s ease",
              }}
            />
            <Form.Text className="text-muted">
              Password must be at least 8 characters long
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label
              style={{
                color: "#455a64",
                fontWeight: "500",
                marginBottom: "0.5rem",
              }}
            >
              I want to join as a:
            </Form.Label>
            <Form.Select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                transition: "border-color 0.2s ease",
              }}
            >
              <option value="podcaster">Podcaster</option>
              <option value="expert">Expert</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#6495ED",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                fontWeight: "500",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#5c85d6")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#6495ED")}
            >
              {isLoading ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </Form>
        <div
          className="text-center mt-4"
          style={{ color: "#666", fontSize: "0.9rem" }}
        >
          <p className="mb-0">
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#6495ED",
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Login here
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Register;
