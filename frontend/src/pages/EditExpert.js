import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaTag } from "react-icons/fa";

const EditExpert = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    email: "",
    category_ids: [],
  });
  const [categories, setCategories] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/experts/categories/");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Don't block the form if categories fail to load
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // First check if this is the user's own profile
        const myProfileResponse = await api.get("/experts/my-profile/");

        // If the profile ID doesn't match, redirect to their own profile
        if (myProfileResponse.data.id !== parseInt(id)) {
          toast.error("You can only edit your own profile");
          navigate(`/experts/${myProfileResponse.data.id}/edit`);
          return;
        }

        // Extract category IDs from the categories array
        const categoryIds = myProfileResponse.data.categories
          ? myProfileResponse.data.categories.map((cat) => cat.id)
          : [];

        // Use the my-profile endpoint to get the profile data
        setFormData({
          ...myProfileResponse.data,
          category_ids: categoryIds,
        });

        // Set image preview if profile picture exists
        if (myProfileResponse.data.profile_picture_url) {
          setImagePreview(myProfileResponse.data.profile_picture_url);
        }

        setFetching(false);
      } catch (error) {
        console.error("Fetch profile error:", error);
        if (error.response?.status === 404) {
          toast.error(
            "You don't have an expert profile yet. Please create one first."
          );
          navigate("/experts/create");
          return;
        }
        toast.error("Failed to load profile");
        setError(
          error.response?.data?.detail ||
            "An error occurred while fetching the expert profile."
        );
        setFetching(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    // Clear field-specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfilePicture(null);
    setImagePreview(null);
  };

  const handleCategoryChange = (categoryId) => {
    const categoryIdInt = parseInt(categoryId);
    setFormData((prev) => {
      const currentCategories = prev.category_ids || [];
      const isSelected = currentCategories.includes(categoryIdInt);

      if (isSelected) {
        // Remove category
        return {
          ...prev,
          category_ids: currentCategories.filter((id) => id !== categoryIdInt),
        };
      } else {
        // Add category
        return {
          ...prev,
          category_ids: [...currentCategories, categoryIdInt],
        };
      }
    });
    // Clear category error if exists
    if (errors.category_ids) {
      setErrors({ ...errors, category_ids: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Submitting form data:", formData);
      console.log("Profile picture:", profilePicture);

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

      if (profilePicture) {
        submitData.append("profile_picture", profilePicture);
      }

      // Append category_ids if any are selected
      if (formData.category_ids && formData.category_ids.length > 0) {
        formData.category_ids.forEach((categoryId) => {
          submitData.append("category_ids", categoryId);
        });
      }

      console.log("Submitting to /experts/my-profile/");
      const response = await api.put("/experts/my-profile/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update response:", response.data);
      toast.success("Profile updated successfully");
      navigate(`/experts/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error response:", error.response);

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle field-specific validation errors
        if (typeof errorData === "object" && !errorData.detail) {
          const fieldErrors = {};
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              fieldErrors[key] = errorData[key][0];
            } else {
              fieldErrors[key] = errorData[key];
            }
          });
          setErrors(fieldErrors);
        } else {
          setError(errorData.detail || "Failed to update profile");
        }
      } else {
        setError(
          "An error occurred while updating your profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container className="mt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Edit Expert Profile</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            isInvalid={!!errors.bio}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.bio}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expertise</Form.Label>
          <Form.Control
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            isInvalid={!!errors.expertise}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.expertise}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Years of Experience</Form.Label>
          <Form.Control
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            isInvalid={!!errors.experience_years}
            required
            min="0"
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

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <FaTag className="me-2" />
            Categories
          </Form.Label>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`border rounded p-2 ${
                  formData.category_ids?.includes(category.id)
                    ? "bg-primary text-white border-primary"
                    : "bg-light border-secondary"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => handleCategoryChange(category.id)}
                onMouseEnter={(e) => {
                  if (!formData.category_ids?.includes(category.id)) {
                    e.currentTarget.style.backgroundColor = "#e9ecef";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!formData.category_ids?.includes(category.id)) {
                    e.currentTarget.style.backgroundColor = "";
                  }
                }}
              >
                <Form.Check
                  type="checkbox"
                  checked={
                    formData.category_ids?.includes(category.id) || false
                  }
                  onChange={() => {}} // Handled by onClick
                  label={category.name}
                  className="mb-0"
                  style={{ pointerEvents: "none" }}
                />
                {category.description && (
                  <small className="d-block text-muted mt-1" style={{ fontSize: "0.75rem" }}>
                    {category.description}
                  </small>
                )}
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <Form.Text className="text-muted">
              Loading categories...
            </Form.Text>
          )}
          {errors.category_ids && (
            <Form.Text className="text-danger">{errors.category_ids}</Form.Text>
          )}
          <Form.Text className="text-muted">
            Select the categories that best describe your expertise areas
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          {imagePreview ? (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Profile preview"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                className="mb-2"
              />
              <div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={removeImage}
                  className="me-2"
                >
                  <FaTimes className="me-1" />
                  Remove
                </Button>
              </div>
            </div>
          ) : null}
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <Form.Text className="text-muted">
            Upload a new profile picture (optional)
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>

        <Button
          type="button"
          variant="outline-secondary"
          className="ms-2"
          onClick={() => navigate(`/experts/${id}`)}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditExpert;
