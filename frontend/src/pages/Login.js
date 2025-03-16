import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Sending login request:", formData);
      const response = await api.post("/users/login/", formData);
      console.log("Login response:", response.data);

      if (response.data.access) {
        // Store the access token
        localStorage.setItem("token", response.data.access);
        // Store user data
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        localStorage.setItem("userType", response.data.user.user_type);

        // Update the default authorization header for future requests
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access}`;

        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 401) {
          setError("Invalid username or password");
        } else if (error.response.status === 403) {
          setError("Please verify your email before logging in");
        } else {
          setError(error.response.data.detail || "Login failed");
        }
      } else if (error.code === "ERR_NETWORK") {
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
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-3" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
