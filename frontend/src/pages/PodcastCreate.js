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
        await api.get("/podcasts/profiles/");
        setNeedsProfile(false);
      } catch (error) {
        if (error.response?.status === 404) {
          setNeedsProfile(true);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get("/podcasts/categories/");
        setCategories(res.data);
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
    setIsLoading(true);
    
    try {
      // Create FormData to handle file uploads
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('link', formData.link);
      submitData.append('category_id', formData.category_id);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      await api.post("/podcasts/create/", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success("Podcast created successfully! It will be published after admin approval.");
      navigate("/podcasts");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
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
