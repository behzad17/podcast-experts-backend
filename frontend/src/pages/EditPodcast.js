import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const EditPodcast = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    language: "",
    website: "",
    social_media: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await api.get(`/podcasts/podcasts/${id}/`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching podcast:", error);
        toast.error("Failed to load podcast");
        navigate("/podcasts");
      }
    };

    fetchPodcast();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/podcasts/podcasts/${id}/`, formData);
      toast.success("Podcast updated successfully");
      navigate(`/podcasts/${id}`);
    } catch (error) {
      console.error("Error updating podcast:", error);
      toast.error(error.response?.data?.detail || "Failed to update podcast");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Edit Podcast</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title *</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
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
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Language *</Form.Label>
          <Form.Control
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Media</Form.Label>
          <Form.Control
            type="text"
            name="social_media"
            value={formData.social_media || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/podcasts/${id}`)}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditPodcast;
