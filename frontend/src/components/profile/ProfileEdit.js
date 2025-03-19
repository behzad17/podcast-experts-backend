import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, Image } from "react-bootstrap";
import api from "../../api/axios";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    profile_picture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData) {
          setError("Please log in to edit your profile");
          return;
        }

        const response = await api.get(`/experts/my_profile/`);
        const profile = response.data;

        setFormData({
          name: profile.name || "",
          bio: profile.bio || "",
          expertise: profile.expertise || "",
          experience_years: profile.experience_years || "",
          website: profile.website || "",
          social_media: profile.social_media || "",
          profile_picture: null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.patch("/experts/my_profile/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 className="mb-4">Edit Profile</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <div className="d-flex align-items-center gap-3">
              {(previewImage || formData.profile_picture) && (
                <Image
                  src={previewImage || formData.profile_picture}
                  alt="Profile preview"
                  rounded
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </Form.Group>

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
              value={formData.website}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Social Media</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="social_media"
              value={formData.social_media}
              onChange={handleChange}
              placeholder="Enter your social media links (one per line)"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
            className="w-100"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfileEdit;
