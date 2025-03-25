import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaPlay, FaShare, FaEdit } from "react-icons/fa";

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await api.get(`/podcasts/podcasts/${id}/`);
        setPodcast(response.data);
        setIsOwner(response.data.creator === user?.id);
      } catch (error) {
        console.error("Error fetching podcast:", error);
        setError("Failed to load podcast details. Please try again later.");
      }
    };

    fetchPodcast();
  }, [id, user]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: podcast.title,
        text: podcast.description,
        url: window.location.href,
      });
    }
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!podcast) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
                loading="lazy"
              />
            )}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="h2 mb-0">{podcast.title}</Card.Title>
                {isOwner && (
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate(`/podcasts/${id}/edit`)}
                  >
                    <FaEdit className="me-2" />
                    Edit Podcast
                  </Button>
                )}
              </div>
              <Card.Text className="lead mb-4">{podcast.description}</Card.Text>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <Badge bg="primary" className="me-2">
                    By {podcast.owner?.channel_name || "Unknown"}
                  </Badge>
                  <Badge bg="secondary">
                    {new Date(podcast.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <div>
                  <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={handleShare}
                  >
                    <FaShare className="me-2" />
                    Share
                  </Button>
                  {podcast.link && (
                    <Button
                      variant="primary"
                      href={podcast.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaPlay className="me-2" />
                      Listen Now
                    </Button>
                  )}
                </div>
              </div>

              {!podcast.is_approved && (
                <Alert variant="warning">
                  This podcast is pending approval.
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
