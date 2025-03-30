import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import {
  FaShare,
  FaEdit,
  FaUser,
  FaCalendar,
  FaGlobe,
  FaMicrophone,
} from "react-icons/fa";
import CommentSection from "../components/comments/CommentSection";
import ReactPlayer from "react-player";

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("userData"));

  const fetchPodcastData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // Fetch podcast data
      const response = await api.get(`/podcasts/podcasts/${id}/`);
      setPodcast(response.data);
      setIsOwner(response.data.user === user?.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Error fetching podcast details");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    fetchPodcastData();
  }, [fetchPodcastData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: podcast.title,
        text: podcast.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!podcast) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Podcast not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h2>{podcast.title}</h2>
              <p className="text-muted">{podcast.description}</p>
              {podcast.audio_url && (
                <div className="mb-4">
                  <ReactPlayer
                    url={podcast.audio_url}
                    controls
                    width="100%"
                    height="50px"
                  />
                </div>
              )}
              <div className="mb-3">
                <strong>Category:</strong>{" "}
                <Badge bg="primary">{podcast.category?.name}</Badge>
              </div>
              <div className="mb-3">
                <strong>Created by:</strong> {podcast.creator_name || "Unknown"}
              </div>
              <div className="mb-3">
                <strong>Created on:</strong>{" "}
                {new Date(podcast.created_at).toLocaleDateString()}
              </div>
              {isOwner && (
                <Link to={`/podcasts/${id}/edit`}>
                  <Button variant="primary" className="me-2">
                    <FaEdit /> Edit Podcast
                  </Button>
                </Link>
              )}
              <Button variant="outline-secondary" onClick={handleShare}>
                <FaShare /> Share
              </Button>
            </Col>
            <Col md={4}>
              {podcast.thumbnail && (
                <img
                  src={podcast.thumbnail}
                  alt={podcast.title}
                  className="img-fluid rounded"
                />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h3>Comments</h3>
          <CommentSection
            type="podcast"
            id={id}
            comments={podcast.comments || []}
            currentUser={user}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PodcastDetail;
