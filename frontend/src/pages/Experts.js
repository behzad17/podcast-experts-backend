import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get("/experts/");
        setExperts(response.data);
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
  if (error) return <div>{error}</div>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Expert Profiles</h1>
          {user && <div className="text-muted">Welcome, {user.username}!</div>}
          {!user && (
            <div className="text-muted">Browse our expert profiles</div>
          )}
        </div>
        {user && (
          <Link to="/experts/create">
            <Button variant="primary">Create Expert Profile</Button>
          </Link>
        )}
      </div>
      <Row>
        {experts.map((expert) => (
          <Col key={expert.id} md={4} className="mb-4">
            <Card>
              {expert.cover_image && (
                <Card.Img
                  variant="top"
                  src={expert.cover_image}
                  alt={expert.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{expert.title}</Card.Title>
                <Card.Text>{expert.description.substring(0, 150)}...</Card.Text>
                <Link to={`/experts/${expert.id}`}>
                  <Button variant="primary">View Profile</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Experts;
