import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/experts/");
      setExperts(response.data || []);
    } catch (error) {
      console.error("Error fetching experts:", error);
      setError("Failed to load experts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExperts = (experts || []).filter((expert) =>
    expert?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="mt-4">
        <h2 className="text-center">Loading experts...</h2>
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
      <h2 className="text-center">Find the Best Experts</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Row>
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => (
            <Col key={expert.id} md={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{expert?.name || "Unknown Expert"}</Card.Title>
                  <Card.Text>{expert?.specialty || "No Specialty"}</Card.Text>
                  <Card.Text>{expert?.country || "No Country Info"}</Card.Text>
                  <Button variant="primary" href={`/expert/${expert.id}`}>
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Alert variant="info">No experts found.</Alert>
        )}
      </Row>
    </Container>
  );
};

export default Experts;
