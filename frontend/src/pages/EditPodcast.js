import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
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
    category_id: "",
    link: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch podcast data
        const response = await api.get(`/podcasts/${id}/`);
        const podcast = response.data;
        
        // Fetch categories
        const categoriesResponse = await api.get("/podcasts/categories/");
        setCategories(categoriesResponse.data);
        
        // Set form data with proper field mapping
        setFormData({
          title: podcast.title || "",
          description: podcast.description || "",
          category_id: podcast.category?.id || "",
          link: podcast.link || "",
          image: null, // Don't pre-populate image for security
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load podcast data");
        navigate("/podcasts");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Always send required fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category_id", formData.category_id);
      
      // Only send optional fields if they have values
      if (formData.link) {
        formDataToSend.append("link", formData.link);
      }
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await api.put(`/podcasts/${id}/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
          <Form.Label>Podcast Link</Form.Label>
          <Form.Control
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://your-podcast-platform.com/episode"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cover Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
          <Form.Text className="text-muted">
            Leave empty to keep current image
          </Form.Text>
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
