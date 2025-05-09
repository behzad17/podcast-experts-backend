import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate("/profile");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container
        style={{
          maxWidth: "400px",
          background: "white",
          padding: "2rem",
          borderRadius: "15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            color: "#6495ED",
            fontSize: "2rem",
            fontWeight: "600",
          }}
        >
          Welcome Back
        </h2>
        {error && (
          <Alert
            variant="danger"
            style={{
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "none",
              backgroundColor: "#ffebee",
              color: "#c62828",
            }}
          >
            {error}
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                transition: "border-color 0.2s ease",
              }}
            />
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </Form>
        <div
          className="text-center mt-4"
          style={{ color: "#666", fontSize: "0.9rem" }}
        >
          <p className="mb-0">
            Don't have an account?{" "}
            <a
              href="/register"
              style={{
                color: "#6495ED",
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Register here
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Login;
