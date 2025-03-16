import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ExpertProfileCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to create an expert profile");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      console.log("Sending expert profile creation request:", formData);
      const response = await api.post("/experts/profile/create/", formData);
      console.log("Profile creation response:", response.data);

      setSuccess(true);
      setTimeout(() => {
        navigate("/experts");
      }, 2000);
    } catch (error) {
      console.error("Profile creation error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Please log in to create an expert profile");
          navigate("/login");
        } else if (error.response.status === 400) {
          setError("Please check your input and try again");
        } else if (error.response.status === 403) {
          setError("You already have an expert profile");
        } else {
          setError(error.response.data.detail || "Error creating profile");
        }
      } else if (error.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please check if the server is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Expert Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Profile created successfully! Redirecting to experts page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
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
            placeholder="Tell us about yourself and your expertise"
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
            placeholder="e.g., Machine Learning, Web Development, Digital Marketing"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Years of Experience *</Form.Label>
          <Form.Control
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter number of years"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://your-website.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Media</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="social_media"
            value={formData.social_media}
            onChange={handleChange}
            placeholder="List your social media links (LinkedIn, Twitter, etc.)"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Create Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertProfileCreate;
