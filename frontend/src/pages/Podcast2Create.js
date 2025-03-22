import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Podcast2Create = () => {
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

      const response = await api.post("/podcast2/podcasts2/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/podcast2/${response.data.id}`);
    } catch (err) {
      console.error("Error creating podcast:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to create podcast. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create New Podcast</h2>
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
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Audio File</Form.Label>
          <Form.Control
            type="file"
            name="audio_file"
            onChange={handleChange}
            accept="audio/*"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            name="cover_image"
            onChange={handleChange}
            accept="image/*"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Podcast"}
        </Button>
      </Form>
    </Container>
  );
};

export default Podcast2Create;
