import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const PodcasterProfileEdit = () => {
  const [formData, setFormData] = useState({
    bio: "",
    website: "",
    social_links: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/podcasts/profiles/my_profile/");
      const profile = response.data;
      setFormData({
        bio: profile.bio || "",
        website: profile.website || "",
        social_links: profile.social_links || {}
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/podcasts/profiles/my_profile/", formData);
      toast.success("Profile updated successfully!");
      navigate("/podcaster/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h3 className="mb-0">Edit Podcaster Profile</h3>
        </Card.Header>
        <Card.Body className="p-4">
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
                placeholder="Tell us about yourself and your podcasting experience..."
              />
              <Form.Text className="text-muted">
                Share your background, interests, and what makes your podcasts unique.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://your-website.com"
              />
              <Form.Text className="text-muted">
                Your personal or professional website (optional).
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading}
                className="px-4"
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline-secondary"
                onClick={() => navigate("/podcaster/profile")}
                className="px-4"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PodcasterProfileEdit;
