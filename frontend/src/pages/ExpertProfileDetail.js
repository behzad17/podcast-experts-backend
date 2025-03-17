import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ExpertProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching expert profile for ID:", id);
        const response = await api.get(`/experts/${id}/`);
        console.log("Expert profile response:", response.data);
        setProfile(response.data);
        setFormData(response.data);

        // Check if the current user is the owner
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (token && userData) {
          try {
            console.log("Checking user ownership...");
            const userResponse = await api.get(`/users/${userData.id}/`);
            console.log("User response:", userResponse.data);
            setIsOwner(userResponse.data.id === response.data.user.id);
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            console.error("User error response:", userError.response?.data);
            setIsOwner(false);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        console.error("Error response:", error.response?.data);
        if (error.response) {
          if (error.response.status === 404) {
            setError("Profile not found");
          } else if (error.response.status === 403) {
            setError("This profile is not approved yet");
          } else {
            setError(error.response.data.detail || "Error loading profile");
          }
        } else if (error.code === "ERR_NETWORK") {
          setError(
            "Cannot connect to server. Please check your internet connection."
          );
        } else {
          setError("An unexpected error occurred while loading the profile");
        }
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      console.log("Updating expert profile...");
      const response = await api.patch(`/experts/${id}/`, formData);
      console.log("Update response:", response.data);
      setProfile(response.data);
      setSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Update error response:", error.response?.data);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Please log in to update the profile");
          navigate("/login");
        } else if (error.response.status === 403) {
          setError("You don't have permission to update this profile");
        } else {
          setError(error.response.data.detail || "Error updating profile");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Container className="mt-4">Loading...</Container>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Profile not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Expert Profile</h2>
        {isOwner && !isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {success && (
        <Alert variant="success">Profile updated successfully!</Alert>
      )}

      {isEditing ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio *</Form.Label>
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
            <Form.Label>Expertise *</Form.Label>
            <Form.Control
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Years of Experience *</Form.Label>
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
              value={formData.website}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Social Media</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="social_media"
              value={formData.social_media}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData(profile);
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <div>
          <h4>{profile.name}</h4>
          <p className="text-muted">
            Experience: {profile.experience_years} years
          </p>
          <h5>Expertise</h5>
          <p>{profile.expertise}</p>
          <h5>Bio</h5>
          <p>{profile.bio}</p>
          {profile.website && (
            <>
              <h5>Website</h5>
              <p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </a>
              </p>
            </>
          )}
          {profile.social_media && (
            <>
              <h5>Social Media</h5>
              <p style={{ whiteSpace: "pre-wrap" }}>{profile.social_media}</p>
            </>
          )}
          {!profile.is_approved && (
            <Alert variant="warning">
              This profile is pending admin approval
            </Alert>
          )}
        </div>
      )}
    </Container>
  );
};

export default ExpertProfileDetail;
