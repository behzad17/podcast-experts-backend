import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/experts/");
      setExperts(response.data || []); // جلوگیری از مقدار null
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };

  const filteredExperts = (experts || []).filter((expert) =>
    expert?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p>No experts found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Experts;
