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
  ListGroup,
} from "react-bootstrap";
import {
  FaPlay,
  FaShare,
  FaEdit,
  FaUser,
  FaCalendar,
  FaGlobe,
  FaMicrophone,
  FaStar,
} from "react-icons/fa";
import CommentSection from "../components/comments/CommentSection";
import RatingButton from "../components/common/RatingButton";
import ReactPlayer from "react-player";

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("userData"));

  const fetchPodcastData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      // Fetch podcast data
      const response = await api.get(`/podcasts/podcasts/${id}/`);
      setPodcast(response.data);
      setIsOwner(response.data.creator === user?.id);
      setAverageRating(response.data.average_rating || 0);

      // Fetch user rating if user is logged in
      if (user?.id) {
        const ratingResponse = await api.get(`/ratings/podcast/${id}/`);
        setCurrentUserRating(ratingResponse.data.score);
      }
    } catch (error) {
      console.error("Error fetching podcast:", error);
      setError("Failed to load podcast details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchPodcastData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchPodcastData]);

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

  if (isLoading || !podcast) {
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
          <Card className="mb-4">
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
                    <FaMicrophone className="me-1" />
                    {podcast.owner?.channel_name || "Unknown"}
                  </Badge>
                  <Badge bg="secondary">
                    <FaCalendar className="me-1" />
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

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaStar className="text-warning me-2" />
                  <span className="me-2">Average Rating:</span>
                  <span className="fw-bold">{averageRating.toFixed(1)}</span>
                </div>
                <RatingButton
                  type="podcast"
                  id={podcast.id}
                  initialRating={currentUserRating}
                />
              </div>

              <div className="mb-3">
                <ReactPlayer
                  url={podcast.audio_url}
                  controls
                  width="100%"
                  height="50px"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Podcaster Information Card */}
          {podcast.owner && (
            <Card>
              <Card.Body>
                <Card.Title className="h4 mb-4">
                  <FaUser className="me-2" />
                  About the Podcaster
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Channel Name:</strong> {podcast.owner.channel_name}
                  </ListGroup.Item>
                  {podcast.owner.bio && (
                    <ListGroup.Item>
                      <strong>Bio:</strong> {podcast.owner.bio}
                    </ListGroup.Item>
                  )}
                  {podcast.owner.website && (
                    <ListGroup.Item>
                      <strong>Website:</strong>{" "}
                      <a
                        href={podcast.owner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {podcast.owner.website}
                      </a>
                    </ListGroup.Item>
                  )}
                  {podcast.owner.social_links &&
                    Object.keys(podcast.owner.social_links).length > 0 && (
                      <ListGroup.Item>
                        <strong>Social Links:</strong>
                        <div className="mt-2">
                          {Object.entries(podcast.owner.social_links).map(
                            ([platform, url]) => (
                              <Button
                                key={platform}
                                variant="outline-secondary"
                                size="sm"
                                className="me-2 mb-2"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FaGlobe className="me-1" />
                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                              </Button>
                            )
                          )}
                        </div>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {/* Comments Section */}
          <CommentSection type="podcast" id={id} />
        </Col>
      </Row>
    </Container>
  );
};

export default PodcastDetail;
