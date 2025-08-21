import React, { useEffect, useState, useCallback } from "react";
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
import LikeButton from "../components/common/LikeButton";
import MessageButton from "../components/common/MessageButton";

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
      const response = await api.get(`/podcasts/${id}/`);
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
      <Card className="podcast-detail-card shadow-sm">
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="podcast-title">{podcast.title}</h2>
                  <div className="podcast-meta">
                    <span className="text-muted">
                      <FaUser className="me-1" />
                      {podcast.creator_name || "Unknown"}
                    </span>
                    <span className="text-muted ms-3">
                      <FaCalendar className="me-1" />
                      {new Date(podcast.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <LikeButton
                    itemId={podcast.id}
                    type="podcasts"
                    initialCount={podcast.likes_count}
                    className="btn-lg"
                  />
                  {podcast.link && (
                    <Button
                      variant="primary"
                      href={podcast.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="listen-btn"
                    >
                      <FaMicrophone className="me-2" />
                      Listen
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    onClick={handleShare}
                    className="share-btn"
                  >
                    <FaShare className="me-2" />
                    Share
                  </Button>
                  {user && podcast.owner?.user && podcast.owner.user !== user.id && (
                    <MessageButton
                      targetUserId={podcast.owner.user}
                      targetUsername={podcast.owner.username}
                      targetType="podcaster"
                      variant="outline-success"
                      size="lg"
                    />
                  )}
                  {isOwner && (
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate(`/podcasts/${id}/edit`)}
                      className="edit-btn"
                    >
                      <FaEdit className="me-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="podcast-description mb-4">
                <p>{podcast.description}</p>
              </div>
              {podcast.audio_url && (
                <div className="audio-player mb-4">
                  <div className="audio-player-header">
                    <FaMicrophone className="me-2" />
                    <span>Listen to the Podcast</span>
                  </div>
                  <ReactPlayer
                    url={podcast.audio_url}
                    controls
                    width="100%"
                    height="50px"
                  />
                </div>
              )}
              <div className="podcast-category mb-4">
                <strong>Category:</strong>{" "}
                <Badge bg="primary" className="category-badge">
                  {podcast.category?.name}
                </Badge>
              </div>
              <div className="podcast-stats">
                <div className="stat-item">
                  <span className="stat-value">{podcast.likes_count || 0}</span>
                  <span className="stat-label">Likes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {podcast.comments?.length || 0}
                  </span>
                  <span className="stat-label">Comments</span>
                </div>
              </div>
            </Col>
            <Col md={4}>
              {podcast.image && (
                <div className="podcast-image-container">
                  <img
                    src={podcast.image}
                    alt={podcast.title}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                  <div className="image-overlay">
                    <Button
                      variant="light"
                      className="view-image-btn"
                      onClick={() => window.open(podcast.image, "_blank")}
                    >
                      <FaGlobe className="me-2" />
                      View Full Image
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="podcast-comments-section mt-4 shadow-sm">
        <Card.Body>
          <div className="section-header">
            <h3>Comments</h3>
            <p className="section-subtitle">
              Share your thoughts about this podcast
            </p>
          </div>
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
