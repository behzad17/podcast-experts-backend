import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ExpertCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_file: null,
    cover_image: null,
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      if (formData.audio_file) {
        formDataToSend.append("audio_file", formData.audio_file);
      }
      if (formData.cover_image) {
        formDataToSend.append("cover_image", formData.cover_image);
      }

      const response = await api.post("/experts/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/experts/${response.data.id}`);
    } catch (err) {
      console.error("Error creating expert profile:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to create expert profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Expert Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Your expertise title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your expertise and experience"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Audio Introduction</Form.Label>
          <Form.Control
            type="file"
            name="audio_file"
            onChange={handleChange}
            accept="audio/*"
            required
          />
          <Form.Text className="text-muted">
            Add a brief audio introduction of yourself
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            name="cover_image"
            onChange={handleChange}
            accept="image/*"
          />
          <Form.Text className="text-muted">
            Add a professional profile picture
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Expert Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertCreate;
