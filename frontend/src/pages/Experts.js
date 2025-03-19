import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get("/experts/");
        setExperts(response.data);
      } catch (error) {
        console.error("Error fetching experts:", error);
        setError("Failed to load experts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const handleCreateExpert = () => {
    navigate("/experts/create");
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div>Loading experts...</div>
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

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Experts</h2>
        <Button variant="primary" onClick={handleCreateExpert}>
          Create Expert Profile
        </Button>
      </div>
      <Row>
        {experts.map((expert) => (
          <Col key={expert.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{expert.user?.username || "Anonymous"}</Card.Title>
                <Card.Text>
                  <strong>Specialty:</strong> {expert.specialty}
                </Card.Text>
                <Card.Text>
                  <strong>Experience:</strong> {expert.experience} years
                </Card.Text>
                <Card.Text>
                  <strong>Hourly Rate:</strong> ${expert.hourly_rate}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/experts/${expert.id}`)}
                >
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Experts;
