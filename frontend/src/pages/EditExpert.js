import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaImage, FaTimes } from "react-icons/fa";

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
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

        // Use the my-profile endpoint to get the profile data
        setFormData(myProfileResponse.data);
        
        // Set image preview if profile picture exists
        if (myProfileResponse.data.profile_picture_url) {
          setImagePreview(myProfileResponse.data.profile_picture_url);
        }
        
        setFetching(false);
      } catch (error) {
        console.error("Fetch profile error:", error);
        if (error.response?.status === 404) {
          toast.error("You don't have an expert profile yet. Please create one first.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      toast.error(error.response?.data?.detail || "Failed to update profile");
      setError(error.response?.data?.detail || "Failed to update profile");
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
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expertise</Form.Label>
          <Form.Control
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Years of Experience</Form.Label>
          <Form.Control
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            required
            min="0"
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
          <Form.Label>Profile Picture</Form.Label>
          {imagePreview ? (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Profile preview"
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
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
