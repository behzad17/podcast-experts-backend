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
        const response = await api.get("/experts/");
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Expert Profiles</h2>
        <Link to="/experts/create">
          <Button variant="primary">
            Add Expert Profile
          </Button>
        </Link>
      </div>

      {experts.length === 0 ? (
        <Alert variant="info">
          No expert profiles found. Be the first to create one!
        </Alert>
      ) : (
        <Row>
          {experts.map((expert) => (
            <Col key={expert.id} md={4} className="mb-4">
              <Card className="h-100">
                {expert.profile_image && (
                  <Card.Img
                    variant="top"
                    src={expert.profile_image}
                    alt={expert.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="h4">{expert.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {expert.expertise}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Experience:</strong> {expert.experience_years} years
                  </Card.Text>
                  <Card.Text className="text-truncate">
                    {expert.bio}
                  </Card.Text>
                  <div className="d-flex gap-2 mb-3">
                    {expert.website && (
                      <Card.Link
                        href={expert.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Website
                      </Card.Link>
                    )}
                    {expert.social_media && (
                      <Card.Link
                        href={`https://${expert.social_media}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Social Media
                      </Card.Link>
                    )}
                  </div>
                  <Link to={`/experts/${expert.id}`} className="d-block">
                    <Button variant="primary" className="w-100">
                      View Profile
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Experts;
