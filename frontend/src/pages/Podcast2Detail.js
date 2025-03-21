import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

function Podcast2Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await api.get(`/podcast2/podcasts2/${id}/`);
        setPodcast(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching podcast details:", err);
        setError("Failed to fetch podcast details");
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await api.post(`/podcast2/podcasts2/${id}/like/`);
      setPodcast((prev) => ({
        ...prev,
        likes_count: response.data.likes_count,
        dislikes_count: response.data.dislikes_count,
        is_liked: response.data.is_liked,
      }));
      toast.success(response.data.is_liked ? "Podcast liked!" : "Like removed");
    } catch (err) {
      console.error("Error liking podcast:", err);
      toast.error("Failed to like podcast");
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/podcast2/podcasts2/${id}/dislike/`);
      setPodcast((prev) => ({
        ...prev,
        likes_count: response.data.likes_count,
        dislikes_count: response.data.dislikes_count,
        is_disliked: response.data.is_disliked,
      }));
      toast.success(
        response.data.is_disliked ? "Podcast disliked!" : "Dislike removed"
      );
    } catch (err) {
      console.error("Error disliking podcast:", err);
      toast.error("Failed to dislike podcast");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!podcast) return <div>Podcast not found</div>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              {podcast.image && (
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="img-fluid"
                />
              )}
            </Col>
            <Col md={8}>
              <h1>{podcast.title}</h1>
              <p>{podcast.description}</p>
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant={podcast.is_liked ? "success" : "outline-success"}
                  onClick={handleLike}
                  disabled={!user}
                >
                  👍 {podcast.likes_count}
                </Button>
                <Button
                  variant={podcast.is_disliked ? "danger" : "outline-danger"}
                  onClick={handleDislike}
                  disabled={!user}
                >
                  👎 {podcast.dislikes_count}
                </Button>
              </div>
              {user && podcast.owner.user.id === user.id && (
                <Button
                  variant="primary"
                  onClick={() => navigate(`/podcast2/${id}/edit`)}
                  className="me-2"
                >
                  Edit Podcast
                </Button>
              )}
              <Button variant="secondary" onClick={() => navigate("/podcast2")}>
                Back to Podcasts
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Podcast2Detail;
