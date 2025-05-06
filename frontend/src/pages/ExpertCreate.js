import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ExpertCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    profile_picture: null,
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
      const userType = localStorage.getItem("userType");

      if (!token) {
        setError("Please log in to create an expert profile");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      if (userType !== "expert") {
        setError("Only users registered as experts can create expert profiles");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }

      setIsAuthenticated(true);
      try {
        // Check if user already has an expert profile
        const response = await api.get("/experts/my-profile/");
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
    if (name === "profile_picture" && files?.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExpertProfile(formData);
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create expert profile"
      );
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
          <Form.Label>Profile Picture *</Form.Label>
          <Form.Control
            type="file"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            required
          />
          <Form.Text className="text-muted">
            Please upload a profile picture (required)
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
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
          <Form.Label>Expertise *</Form.Label>
          <Form.Control
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            required
            placeholder="Enter your expertise"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Experience (years) *</Form.Label>
          <Form.Control
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter years of experience"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter your website URL"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Media</Form.Label>
          <Form.Control
            type="text"
            name="social_media"
            value={formData.social_media}
            onChange={handleChange}
            placeholder="Enter your social media URL"
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
