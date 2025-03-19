import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateExpert = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: "",
    specialization: "",
    experience: "",
    hourly_rate: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      const response = await axios.post(
        "http://localhost:8000/api/experts/",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate(`/experts/${response.data.id}`);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "An error occurred while creating the expert profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Create Expert Profile</h1>

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
          <Form.Label>Specialization</Form.Label>
          <Form.Control
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Experience (years)</Form.Label>
          <Form.Control
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hourly Rate ($)</Form.Label>
          <Form.Control
            type="number"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Profile"}
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => navigate("/experts")}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateExpert;
