import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const PodcastCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    link: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create a podcast");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      setIsAuthenticated(true);
      try {
        // First check if user has a podcaster profile
        await api.get("/podcasts/profiles/");
        // If we get here, user has a profile
        setNeedsProfile(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        if (error.response?.status === 404) {
          setNeedsProfile(true);
        } else {
          setError("Error checking profile status");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create a podcast");
        navigate("/login");
        return;
      }

      if (needsProfile) {
        setError("Please create a podcaster profile first");
        navigate("/podcasts/profile/create");
        return;
      }

      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      console.log("Sending podcast creation request");
      const response = await api.post("/podcasts/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Podcast created successfully:", response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/podcasts/${response.data.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating podcast:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the podcast"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Please log in to create a podcast. Redirecting to login page...
        </Alert>
      </Container>
    );
  }

  if (needsProfile) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          You need to create a podcaster profile before creating a podcast.
        </Alert>
        <Button
          variant="primary"
          onClick={() => navigate("/podcasts/profile/create")}
        >
          Create Podcaster Profile
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Create Podcast</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Podcast created successfully! Redirecting to podcasts page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter podcast title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your podcast"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Link</Form.Label>
          <Form.Control
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://your-podcast-link.com"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Podcast..." : "Create Podcast"}
        </Button>
      </Form>
    </Container>
  );
};

export default PodcastCreate;
