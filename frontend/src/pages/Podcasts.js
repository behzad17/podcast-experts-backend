import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/podcasts/");
      console.log("Fetched podcasts:", response.data);
      setPodcasts(response.data);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      setError("Failed to load podcasts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="mt-4">
        <h2>Loading podcasts...</h2>
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
              {podcast.image && (
                <Card.Img
                  variant="top"
                  src={podcast.image}
                  alt={podcast.title}
                />
              )}
              <Card.Body>
                <Card.Title>{podcast.title}</Card.Title>
                <Card.Text>{podcast.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    By {podcast.owner?.channel_name || "Unknown"}
                  </small>
                  {podcast.link && (
                    <a
                      href={podcast.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Listen
                    </a>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {filteredPodcasts.length === 0 && (
        <Alert variant="info">
          No podcasts found. Try adjusting your search term.
        </Alert>
      )}
    </Container>
  );
};

export default Podcasts;
