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
      <h2 className="mb-4">Experts</h2>
      <Link to="/experts/create">
        <Button variant="primary" className="mb-4">
          Add Expert Profile
        </Button>
      </Link>
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
};

export default Experts;
