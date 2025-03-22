import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ExpertCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    expertise: "",
    experience_years: "",
    bio: "",
    website: "",
    social_media: "",
    profile_image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("expertise", formData.expertise);
    formDataToSend.append("experience_years", formData.experience_years);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("website", formData.website);
    formDataToSend.append("social_media", formData.social_media);
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    try {
      const response = await api.post("/experts/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/experts/${response.data.id}`);
    } catch (err) {
      console.error("Error creating expert profile:", err);
      setError(
        err.response?.data?.message || "Failed to create expert profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Create Expert Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expertise</Form.Label>
          <Form.Control
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Years of Experience</Form.Label>
          <Form.Control
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
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
            type="text"
            name="social_media"
            value={formData.social_media}
            onChange={handleChange}
            placeholder="e.g., twitter.com/username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control
            type="file"
            name="profile_image"
            onChange={handleChange}
            accept="image/*"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertCreate;
