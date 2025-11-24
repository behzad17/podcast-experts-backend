import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { FaTag } from "react-icons/fa";
import { isValidUrl } from "../../utils/validation";

const ProfileEditModal = ({ show, onHide, profile, onUpdate }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    profile_picture: null,
    category_ids: [],
  });
  const [categories, setCategories] = React.useState([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // Fetch categories when modal is shown
    if (show) {
      const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
          const res = await api.get("/experts/categories/");
          console.log("Categories fetched:", res.data);
          // Handle both array and object with results property
          if (Array.isArray(res.data)) {
            setCategories(res.data);
          } else if (res.data.results && Array.isArray(res.data.results)) {
            setCategories(res.data.results);
          } else {
            console.warn("Unexpected categories response format:", res.data);
            setCategories([]);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
          console.error("Error response:", error.response);
          // Don't block the form if categories fail to load, but set empty array
          setCategories([]);
        } finally {
          setCategoriesLoading(false);
        }
      };

      fetchCategories();
    }
  }, [show]);

  React.useEffect(() => {
    if (profile) {
      console.log("Profile data received:", profile);
      console.log("Profile categories:", profile.categories);

      // Extract category IDs from the categories array
      const categoryIds = profile.categories
        ? profile.categories.map((cat) =>
            typeof cat === "object" ? cat.id : cat
          )
        : [];

      console.log("Extracted category IDs:", categoryIds);

      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        expertise: profile.expertise || "",
        experience_years: profile.experience_years || "",
        website: profile.website || "",
        social_media: profile.social_media || "",
        profile_picture: null,
        category_ids: categoryIds,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture" && files?.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
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

    if (!formData.category_ids || formData.category_ids.length === 0) {
      newErrors.category_ids = "At least one category is required";
    }

    // URL validation for website (optional field)
    if (formData.website && formData.website.trim() !== "") {
      if (!isValidUrl(formData.website.trim())) {
        newErrors.website =
          "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    // URL validation for social_media (optional field, but if provided should be valid)
    if (formData.social_media && formData.social_media.trim() !== "") {
      if (!isValidUrl(formData.social_media.trim())) {
        newErrors.social_media =
          "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setError("");
    setErrors({});

    try {
      const formDataToSend = new FormData();

      // Always send required fields
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("bio", formData.bio.trim());
      formDataToSend.append("expertise", formData.expertise.trim());
      formDataToSend.append("experience_years", formData.experience_years);

      // Only send optional fields if they have values
      if (formData.website && formData.website.trim() !== "") {
        formDataToSend.append("website", formData.website.trim());
      }

      if (formData.social_media && formData.social_media.trim() !== "") {
        formDataToSend.append("social_media", formData.social_media.trim());
      }

      if (formData.profile_picture) {
        formDataToSend.append("profile_picture", formData.profile_picture);
      }

      // Append category_ids separately (each ID as a separate entry)
      if (formData.category_ids && formData.category_ids.length > 0) {
        formData.category_ids.forEach((categoryId) => {
          formDataToSend.append("category_ids", categoryId);
        });
      }

      const response = await api.patch(
        `/experts/${profile.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully");
      onUpdate(response.data);
      onHide();
    } catch (error) {
      console.error("Error updating profile:", error);

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
          const errorMsg =
            errorData.detail || "Failed to update profile. Please try again.";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        const errorMsg =
          "An error occurred while updating your profile. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}

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
              rows={3}
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
              value={formData.website}
              onChange={handleChange}
              isInvalid={!!errors.website}
              placeholder="https://example.com"
            />
            <Form.Control.Feedback type="invalid">
              {errors.website}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Social Media</Form.Label>
            <Form.Control
              type="text"
              name="social_media"
              value={formData.social_media}
              onChange={handleChange}
              isInvalid={!!errors.social_media}
              placeholder="https://linkedin.com/in/yourprofile or https://twitter.com/yourhandle"
            />
            <Form.Control.Feedback type="invalid">
              {errors.social_media}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaTag className="me-2" />
              Categories *
            </Form.Label>
            {categories.length > 0 && (
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
                      <small
                        className="d-block text-muted mt-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {category.description}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            )}
            {categoriesLoading && (
              <Form.Text className="text-muted">
                Loading categories...
              </Form.Text>
            )}
            {!categoriesLoading && categories.length === 0 && (
              <Form.Text className="text-warning">
                No categories available. Please refresh the page or contact
                support.
              </Form.Text>
            )}
            {errors.category_ids && (
              <Form.Text className="text-danger d-block mt-1">
                {errors.category_ids}
              </Form.Text>
            )}
            <Form.Text className="text-muted">
              Select at least one category that best describes your expertise
              areas
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="profile_picture"
              onChange={handleChange}
              accept="image/*"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProfileEditModal;
