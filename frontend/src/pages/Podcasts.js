import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form } from "react-bootstrap";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/podcasts/");
      setPodcasts(response.data);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2>Podcasts</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by podcast name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <Row>
        {filteredPodcasts.map((podcast) => (
          <Col key={podcast.id} md={4} className="mb-3">
            <Card>
              <Card.Img variant="top" src={podcast.image} />
              <Card.Body>
                <Card.Title>{podcast.title}</Card.Title>
                <Card.Text>{podcast.description}</Card.Text>
                <a
                  href={podcast.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Podcasts;
