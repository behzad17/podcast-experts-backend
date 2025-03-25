import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

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

        setExpert(response.data);

        // Check if the current user is the owner
        const userResponse = await axios.get(
          "http://localhost:8000/api/users/me/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsOwner(response.data.user === userResponse.data.id);

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "An error occurred while fetching the expert profile."
        );
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id, navigate]);

  if (loading) {
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!expert) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Expert profile not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Expert Profile</h1>
        <div>
          {isOwner && (
            <Link to={`/experts/${id}/edit`} className="me-2">
              <Button variant="primary">Edit Profile</Button>
            </Link>
          )}
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/experts")}
          >
            Back to Experts
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="row">
            <div className="col-md-8">
              <h2 className="mb-3">{expert.user_name}</h2>
              <p className="lead mb-4">{expert.bio}</p>

              <div className="mb-4">
                <h4>Specialization</h4>
                <p>{expert.specialization}</p>
              </div>

              <div className="mb-4">
                <h4>Experience</h4>
                <p>{expert.experience} years</p>
              </div>

              <div className="mb-4">
                <h4>Hourly Rate</h4>
                <p>${expert.hourly_rate}/hour</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExpertDetail;
