import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get("/experts/");
        setExperts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch experts");
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container className="my-4">
      <h2 className="mb-4">Podcast Experts</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {experts.map((expert) => (
          <Col key={expert.id}>
            <Card>
              <Card.Img
                variant="top"
                src={expert.profile_image || "https://via.placeholder.com/150"}
                alt={expert.user.username}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{expert.user.username}</Card.Title>
                <Card.Text>{expert.bio}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Expertise: {expert.expertise}
                  </small>
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/experts/${expert.id}`}
                  >
                    View Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ExpertList;
