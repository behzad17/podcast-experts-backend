import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExpertCreate = () => {
  const [formData, setFormData] = useState({
    specialty: "",
    bio: "",
    experience: "",
    hourly_rate: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create an expert profile");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      setIsAuthenticated(true);
      try {
        // Check if user already has an expert profile
        const response = await axios.get(
          "http://localhost:8000/api/experts/my-profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasProfile(true);
        setError("You already have an expert profile");
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false);
        } else {
          console.error("Error checking profile:", error);
          setError("Failed to check profile status");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create an expert profile");
        navigate("/login");
        return;
      }

      if (hasProfile) {
        setError("You already have an expert profile");
        return;
      }

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      console.log("Sending expert profile creation request");
      const response = await axios.post(
        "http://localhost:8000/api/experts/create/",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Expert profile creation response:", response.data);

      setSuccess(true);
      setTimeout(() => {
        navigate("/experts");
      }, 2000);
    } catch (error) {
      console.error("Expert profile creation error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 401) {
          setError("Please log in to create an expert profile");
          navigate("/login");
        } else if (error.response.status === 400) {
          setError("Please check your input and try again");
        } else if (error.response.status === 403) {
          setError("You don't have permission to create an expert profile");
        } else if (error.response.status === 405) {
          setError("Invalid request method. Please try again.");
        } else {
          setError(
            error.response.data.detail || "Error creating expert profile"
          );
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

  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Please log in to create an expert profile. Redirecting to login
          page...
        </Alert>
      </Container>
    );
  }

  if (hasProfile) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          You already have an expert profile. You cannot create another one.
        </Alert>
        <Button variant="primary" onClick={() => navigate("/experts")}>
          View My Profile
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Create Expert Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Expert profile created successfully! Redirecting to experts page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Specialty *</Form.Label>
          <Form.Control
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
            placeholder="Enter your specialty"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            placeholder="Tell us about yourself"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Experience (years) *</Form.Label>
          <Form.Control
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter years of experience"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hourly Rate ($) *</Form.Label>
          <Form.Control
            type="number"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter your hourly rate"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Create Expert Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertCreate;
