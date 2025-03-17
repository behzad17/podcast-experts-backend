import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import api from "../api/axios";

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await api.get(`/podcasts/${id}/`);
        setPodcast(response.data);
      } catch (error) {
        console.error("Error fetching podcast:", error);
        setError("Failed to load podcast details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-4">
        <h2>Loading podcast details...</h2>
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

  if (!podcast) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Podcast not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            {podcast.image && (
              <Card.Img
                variant="top"
                src={podcast.image}
                alt={podcast.title}
                style={{ height: "300px", objectFit: "cover" }}
              />
            )}
            <Card.Body>
              <Card.Title className="h2 mb-3">{podcast.title}</Card.Title>
              <Card.Text className="lead mb-4">{podcast.description}</Card.Text>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <Badge bg="primary" className="me-2">
                    By {podcast.owner?.channel_name || "Unknown"}
                  </Badge>
                  <Badge bg="secondary">
                    Created {new Date(podcast.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                {podcast.link && (
                  <Button
                    variant="primary"
                    size="lg"
                    href={podcast.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Listen Now
                  </Button>
                )}
              </div>

              {!podcast.is_approved && (
                <Alert variant="warning">
                  This podcast is pending approval
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PodcastDetail; 