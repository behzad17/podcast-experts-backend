import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_type: "podcaster", // Default to podcaster
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength)
      errors.push(`Password must be at least ${minLength} characters long`);
    if (!hasUpperCase)
      errors.push("Password must contain at least one uppercase letter");
    if (!hasLowerCase)
      errors.push("Password must contain at least one lowercase letter");
    if (!hasNumbers) errors.push("Password must contain at least one number");
    if (!hasSpecialChar)
      errors.push("Password must contain at least one special character");

    return errors;
  };

  const validateUsername = (username) => {
    const errors = [];
    if (username.length < 3)
      errors.push("Username must be at least 3 characters long");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores"
      );
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    const usernameErrors = validateUsername(formData.username);
    if (usernameErrors.length > 0) {
      newErrors.username = usernameErrors;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ["Passwords do not match"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Log the registration payload
      const registrationPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        user_type: formData.user_type,
      };
      console.log("Registration request payload:", registrationPayload);

      const response = await register(registrationPayload);
      console.log("Registration response:", response.data);

      setSuccessMessage(
        "Registration successful! Please check your email to verify your account."
      );
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        user_type: "podcaster",
      });
    } catch (error) {
      console.error("Registration error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error,
      });

      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({
          non_field_errors: ["An error occurred during registration"],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Register</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errors.non_field_errors && (
        <Alert variant="danger">
          {errors.non_field_errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
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
            isInvalid={!!errors.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.username &&
              errors.username.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.email &&
              errors.email.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.password &&
              errors.password.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            isInvalid={!!errors.confirmPassword}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword &&
              errors.confirmPassword.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>I want to join as a:</Form.Label>
          <Row>
            <Col>
              <Form.Check
                type="radio"
                id="podcaster"
                name="user_type"
                value="podcaster"
                label="Podcaster"
                checked={formData.user_type === "podcaster"}
                onChange={handleChange}
              />
              <small className="text-muted d-block">
                Create and manage your own podcasts
              </small>
            </Col>
            <Col>
              <Form.Check
                type="radio"
                id="expert"
                name="user_type"
                value="expert"
                label="Expert"
                checked={formData.user_type === "expert"}
                onChange={handleChange}
              />
              <small className="text-muted d-block">
                Share your expertise and connect with podcasters
              </small>
            </Col>
          </Row>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
