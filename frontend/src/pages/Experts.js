import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/experts/");
      setExperts(response.data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2>Experts</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Row>
        {filteredExperts.map((expert) => (
          <Col key={expert.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{expert.name}</Card.Title>
                <Card.Text>{expert.specialty}</Card.Text>
                <Card.Text>{expert.country}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Experts;
