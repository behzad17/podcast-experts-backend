import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PodcasterProfileEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    bio: "",
    expertise: "",
    website: "",
    social_media: {
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/podcasters/${id}/`,
          getAuthHeaders()
        );
        setFormData(response.data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [id, getAuthHeaders]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const platform = name.split("_")[1];
      setFormData((prev) => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [platform]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/podcasters/${id}/`,
        formData,
        getAuthHeaders()
      );
      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update podcaster profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Edit Podcaster Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
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
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </Form.Group>

        <h4 className="mb-3">Social Media</h4>
        <Form.Group className="mb-3">
          <Form.Label>Twitter</Form.Label>
          <Form.Control
            type="text"
            name="social_twitter"
            value={formData.social_media.twitter}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            type="text"
            name="social_instagram"
            value={formData.social_media.instagram}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>LinkedIn</Form.Label>
          <Form.Control
            type="text"
            name="social_linkedin"
            value={formData.social_media.linkedin}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Form>
    </div>
  );
};

export default PodcasterProfileEdit;
