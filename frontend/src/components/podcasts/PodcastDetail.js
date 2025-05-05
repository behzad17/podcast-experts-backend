import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Alert, Row, Col, Button } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getPodcast, likePodcast, unlikePodcast } from "../../services/api";
import LikeButton from "../common/LikeButton";
import { FaShare, FaEdit } from "react-icons/fa";

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("userData"));

  const {
    data: podcast,
    isLoading,
    error,
  } = useQuery(["podcast", id], () => getPodcast(id), {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  const likeMutation = useMutation(() => likePodcast(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["podcast", id]);
    },
  });

  const unlikeMutation = useMutation(() => unlikePodcast(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["podcast", id]);
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: podcast?.title,
        text: podcast?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleEdit = () => {
    navigate(`/podcasts/${id}/edit`);
  };

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error.response?.data?.detail || "Failed to load podcast details"}
        </Alert>
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

  const isOwner = podcast.owner === user?.id;

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
                      By {podcast.creator_name || "Unknown"}
                    </span>
                    <span className="text-muted ms-3">
                      {new Date(podcast.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" onClick={handleShare}>
                    <FaShare className="me-2" />
                    Share
                  </Button>
                  {isOwner && (
                    <Button variant="outline-secondary" onClick={handleEdit}>
                      <FaEdit className="me-2" />
                      Edit
                    </Button>
                  )}
                  <LikeButton
                    isLiked={podcast.is_liked}
                    likesCount={podcast.likes_count}
                    onLike={() => likeMutation.mutate()}
                    onUnlike={() => unlikeMutation.mutate()}
                  />
                </div>
              </div>

              <div className="podcast-description">
                <p>{podcast.description}</p>
              </div>

              {podcast.link && (
                <div className="audio-player mt-4">
                  <div className="audio-player-header">
                    <FaMicrophone className="me-2" />
                    Listen to Podcast
                  </div>
                  <div className="mt-3">
                    <ReactPlayer
                      url={podcast.link}
                      width="100%"
                      height="50px"
                      controls
                    />
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PodcastDetail;
