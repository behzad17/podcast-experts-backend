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
import {
  FaPlay,
  FaShare,
  FaEdit,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import Comments from "../components/Comments";

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

  const handleLike = async () => {
    try {
      const response = await api.post(`/podcasts/podcasts/${id}/like/`);
      setPodcast((prev) => ({
        ...prev,
        is_liked: response.data.is_liked,
        likes_count: response.data.likes_count,
        dislikes_count: response.data.dislikes_count,
      }));
    } catch (error) {
      console.error("Error liking podcast:", error);
      setError("Failed to like podcast. Please try again.");
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/podcasts/podcasts/${id}/dislike/`);
      setPodcast((prev) => ({
        ...prev,
        is_disliked: response.data.is_disliked,
        likes_count: response.data.likes_count,
        dislikes_count: response.data.dislikes_count,
      }));
    } catch (error) {
      console.error("Error disliking podcast:", error);
      setError("Failed to dislike podcast. Please try again.");
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
                  <Badge bg="secondary" className="me-2">
                    {new Date(podcast.created_at).toLocaleDateString()}
                  </Badge>
                  <Badge
                    bg={podcast.is_liked ? "success" : "outline-success"}
                    className="me-2"
                  >
                    <FaThumbsUp className="me-1" />
                    {podcast.likes_count}
                  </Badge>
                  <Badge bg={podcast.is_disliked ? "danger" : "outline-danger"}>
                    <FaThumbsDown className="me-1" />
                    {podcast.dislikes_count}
                  </Badge>
                </div>
                <div>
                  <Button
                    variant={podcast.is_liked ? "success" : "outline-success"}
                    className="me-2"
                    onClick={handleLike}
                  >
                    <FaThumbsUp className="me-2" />
                    Like
                  </Button>
                  <Button
                    variant={podcast.is_disliked ? "danger" : "outline-danger"}
                    className="me-2"
                    onClick={handleDislike}
                  >
                    <FaThumbsDown className="me-2" />
                    Dislike
                  </Button>
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

          <Comments podcastId={id} />
        </Col>
      </Row>
    </Container>
  );
};

export default PodcastDetail;
