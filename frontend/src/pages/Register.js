import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    // Clear error when user starts typing
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
      const response = await api.post("/api/users/register/", formData);
      console.log("Registration response:", response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
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
    <Container className="mt-4">
      <h2>Register</h2>
      {error && (
        <Alert variant="danger" style={{ whiteSpace: "pre-line" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          Registration successful! Please check your email to verify your
          account. You will be redirected to the login page in 5 seconds.
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            disabled={isLoading}
          />
          <Form.Text className="text-muted">
            Password must be at least 8 characters long and contain a mix of
            letters and numbers.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>User Type</Form.Label>
          <Form.Select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="podcaster">Podcaster</option>
            <option value="expert">Expert</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
