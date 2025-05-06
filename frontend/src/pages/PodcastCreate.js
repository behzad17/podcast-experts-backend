import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const PodcastCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await api.get("/podcasts/profiles/");
        setNeedsProfile(false);
      } catch (error) {
        if (error.response?.status === 404) {
          setNeedsProfile(true);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get("/podcasts/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    checkProfile();
    fetchCategories();
  }, []);

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
    try {
      await createPodcast(formData);
      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create podcast");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

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
          <Form.Label>Category *</Form.Label>
          <Form.Select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleImageChange}
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
