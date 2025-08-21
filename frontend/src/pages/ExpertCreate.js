import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ExpertCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    email: "",
    profile_picture: null,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (!token) {
        setError("Please log in to create an expert profile");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      if (userType !== "expert") {
        setError("Only users registered as experts can create expert profiles");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }

      setIsAuthenticated(true);
      try {
        // Check if user already has an expert profile
        const response = await api.get("/experts/my-profile/");
        setHasProfile(true);
        setError("You already have an expert profile");
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false);
        } else {
          console.error("Error checking profile:", error);
          setError("Failed to check profile status");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }
    
    if (!formData.expertise.trim()) {
      newErrors.expertise = "Expertise is required";
    }
    
    if (!formData.experience_years || formData.experience_years < 0) {
      newErrors.experience_years = "Experience years must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture" && files?.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setErrors({});

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("bio", formData.bio);
      submitData.append("expertise", formData.expertise);
      submitData.append("experience_years", formData.experience_years);
      
      if (formData.website) {
        submitData.append("website", formData.website);
      }
      
      if (formData.social_media) {
        submitData.append("social_media", formData.social_media);
      }
      
      if (formData.email) {
        submitData.append("email", formData.email);
      }
      
      if (formData.profile_picture) {
        submitData.append("profile_picture", formData.profile_picture);
      }

      const response = await api.post("/experts/create/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/experts");
      }, 2000);
    } catch (error) {
      console.error("Expert creation error:", error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle field-specific validation errors
        if (typeof errorData === "object" && !errorData.detail) {
          const fieldErrors = {};
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              fieldErrors[key] = errorData[key][0];
            }
          });
          setErrors(fieldErrors);
        } else {
          setError(errorData.detail || "Failed to create expert profile");
        }
      } else {
        setError("An error occurred while creating your profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Please log in to create an expert profile. Redirecting to login
          page...
        </Alert>
      </Container>
    );
  }

  if (hasProfile) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          You already have an expert profile. You cannot create another one.
        </Alert>
        <Button variant="primary" onClick={() => navigate("/experts")}>
          View My Profile
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Create Expert Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Expert profile created successfully! Redirecting to experts page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
          />
          <Form.Text className="text-muted">
            Upload a profile picture (optional)
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            placeholder="Enter your name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio *</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            isInvalid={!!errors.bio}
            placeholder="Tell us about yourself"
          />
          <Form.Control.Feedback type="invalid">
            {errors.bio}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expertise *</Form.Label>
          <Form.Control
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            isInvalid={!!errors.expertise}
            placeholder="Enter your expertise"
          />
          <Form.Control.Feedback type="invalid">
            {errors.expertise}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Experience (years) *</Form.Label>
          <Form.Control
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            isInvalid={!!errors.experience_years}
            min="0"
            placeholder="Enter years of experience"
          />
          <Form.Control.Feedback type="invalid">
            {errors.experience_years}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter your website URL"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Media</Form.Label>
          <Form.Control
            type="text"
            name="social_media"
            value={formData.social_media}
            onChange={handleChange}
            placeholder="Enter your social media profile"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your contact email"
          />
          <Form.Text className="text-muted">
            Contact email for potential clients (optional)
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Create Expert Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertCreate;
