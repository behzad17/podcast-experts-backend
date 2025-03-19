import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditExpert = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    bio: "",
    specialization: "",
    experience: "",
    hourly_rate: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/experts/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFormData(response.data);
        setFetching(false);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "An error occurred while fetching the expert profile."
        );
        setFetching(false);
      }
    };

    fetchExpert();
  }, [id, navigate]);

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

      await axios.put(`http://localhost:8000/api/experts/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/experts/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "An error occurred while updating the expert profile."
      );
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => navigate(`/experts/${id}`)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditExpert;
