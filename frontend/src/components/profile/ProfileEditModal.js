import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../api/axios";

function ProfileEditModal({ show, onHide, profile, onUpdate }) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    social_links: profile?.social_links || {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/users/profile/`, formData);
      onUpdate(response.data);
      onHide();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
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
            <Form.Label>Social Links</Form.Label>
            <Form.Control
              as="textarea"
              name="social_links"
              value={JSON.stringify(formData.social_links, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    social_links: parsed,
                  }));
                } catch (error) {
                  console.error("Invalid JSON:", error);
                }
              }}
              rows={3}
              placeholder='{"twitter": "your-handle", "linkedin": "your-profile"}'
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProfileEditModal;
