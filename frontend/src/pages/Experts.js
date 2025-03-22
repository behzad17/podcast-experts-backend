import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get("/api/experts/");
        setExperts(response.data.results || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching experts:", err);
        setError("Failed to fetch experts");
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Expert Profiles</h2>
      <Link to="/experts/create">
        <Button variant="primary" className="mb-4">
          Add Expert Profile
        </Button>
      </Link>
      <Row>
        {experts.map((expert) => (
          <Col key={expert.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{expert.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {expert.expertise}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Experience:</strong> {expert.experience_years} years
                </Card.Text>
                <Card.Text>{expert.bio}</Card.Text>
                {expert.website && (
                  <Card.Link
                    href={expert.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </Card.Link>
                )}
                {expert.social_media && (
                  <Card.Link
                    href={`https://${expert.social_media}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Social Media
                  </Card.Link>
                )}
                <div className="mt-3">
                  <Link to={`/experts/${expert.id}`}>
                    <Button variant="primary">View Profile</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Experts;
