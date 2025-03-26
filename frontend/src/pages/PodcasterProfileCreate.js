import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const PodcasterProfileCreate = () => {
  const [formData, setFormData] = useState({
    bio: "",
    website: "",
    social_links: {},
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await api.post("/podcasts/profile/create/", formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Profile creation error:", error);
      if (error.response?.status === 400) {
        setError("Please check your input and try again");
      } else if (error.response?.status === 403) {
        setError("You already have a podcaster profile");
      } else {
        setError(error.response?.data?.detail || "Failed to create profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Podcaster Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Profile created successfully! Redirecting to profile page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
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
          <Form.Label>Social Links (JSON format)</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="social_links"
            value={JSON.stringify(formData.social_links, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData({ ...formData, social_links: parsed });
              } catch (error) {
                // If JSON is invalid, just update the textarea
                setFormData({ ...formData, social_links: e.target.value });
              }
            }}
            placeholder='{"twitter": "https://twitter.com/your-handle", "linkedin": "https://linkedin.com/in/your-profile"}'
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Create Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default PodcasterProfileCreate;
