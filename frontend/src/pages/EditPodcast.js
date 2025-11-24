import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { isValidUrl } from "../utils/validation";

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to edit podcasts");
          navigate("/login");
          return;
        }

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
        
        if (error.response?.status === 401) {
          toast.error("Please log in to edit podcasts");
          navigate("/login");
        } else if (error.response?.status === 403) {
          toast.error("You don't have permission to edit this podcast");
          navigate("/podcasts");
        } else {
          toast.error("Failed to load podcast data");
          navigate("/podcasts");
        }
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
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Category validation
    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }

    // Link validation (optional field, but if provided must be valid URL)
    if (formData.link && formData.link.trim() !== "") {
      if (!isValidUrl(formData.link.trim())) {
        newErrors.link = "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Always send required fields
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category_id", formData.category_id);
      
      // Only send optional fields if they have values
      if (formData.link && formData.link.trim() !== "") {
        formDataToSend.append("link", formData.link.trim());
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
      
      // Handle field-specific validation errors from backend
      if (error.response?.data && typeof error.response.data === "object" && !error.response.data.detail) {
        const backendErrors = {};
        Object.keys(error.response.data).forEach((key) => {
          if (Array.isArray(error.response.data[key])) {
            backendErrors[key] = error.response.data[key][0];
          } else {
            backendErrors[key] = error.response.data[key];
          }
        });
        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors);
        }
      }
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Please log in to edit this podcast");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to edit this podcast");
        navigate("/podcasts");
      } else {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           "Failed to update podcast";
        toast.error(errorMessage);
      }
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
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            isInvalid={!!errors.category_id}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.category_id}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Podcast Link</Form.Label>
          <Form.Control
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            isInvalid={!!errors.link}
            placeholder="https://your-podcast-platform.com/episode"
          />
          <Form.Control.Feedback type="invalid">
            {errors.link}
          </Form.Control.Feedback>
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
