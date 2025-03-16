import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const PodcasterProfileCreate = () => {
  const [formData, setFormData] = useState({
    channel_name: "",
    description: "",
    website: "",
    social_media: "",
    topics: "",
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

    try {
      console.log("Sending podcaster profile creation request:", formData);
      const response = await api.post("/podcasts/profile/create/", formData);
      console.log("Profile creation response:", response.data);

      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Profile creation error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 400) {
          setError("Please check your input and try again");
        } else if (error.response.status === 403) {
          setError("You already have a podcaster profile");
        } else {
          setError(error.response.data.detail || "Error creating profile");
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
      <h2>Create Podcaster Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Profile created successfully! Redirecting to profile page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Channel Name</Form.Label>
          <Form.Control
            type="text"
            name="channel_name"
            value={formData.channel_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
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
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Topics</Form.Label>
          <Form.Control
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            required
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
