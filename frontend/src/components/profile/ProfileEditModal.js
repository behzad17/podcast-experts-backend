import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../api/axios";

const ProfileEditModal = ({ show, onHide, profile, onUpdate }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    profile_picture: null,
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        expertise: profile.expertise || "",
        experience_years: profile.experience_years || "",
        website: profile.website || "",
        social_media: profile.social_media || "",
        profile_picture: null,
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.patch(
        `/experts/${profile.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdate(response.data);
      onHide();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
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
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
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
            />
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
