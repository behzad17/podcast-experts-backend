import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ExpertProfileCreate = () => {
  const [formData, setFormData] = useState({
    specialty: "",
    bio: "",
    participation_method: "حضوری",
    sample_works: "",
    contact_methods: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      console.log("Sending expert profile creation request:", formData);
      const response = await api.post("/experts/profile/create/", formData);
      console.log("Profile creation response:", response.data);

      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Profile creation error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.status === 400) {
          setError("Please check your input and try again");
        } else if (error.response.status === 403) {
          setError("You already have an expert profile");
        } else {
          setError(error.response.data.detail || "Error creating profile");
        }
      } else if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create Expert Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">
          Profile created successfully! Redirecting to profile page...
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Specialty</Form.Label>
          <Form.Control
            type="text"
            name="specialty"
            value={formData.specialty}
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
          <Form.Label>Participation Method</Form.Label>
          <Form.Select
            name="participation_method"
            value={formData.participation_method}
            onChange={handleChange}
            required
          >
            <option value="حضوری">حضوری</option>
            <option value="تصویری">تصویری</option>
            <option value="تلفنی">تلفنی</option>
            <option value="مکاتبه">مکاتبه</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sample Works</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="sample_works"
            value={formData.sample_works}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contact Methods</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="contact_methods"
            value={formData.contact_methods}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Create Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpertProfileCreate;
