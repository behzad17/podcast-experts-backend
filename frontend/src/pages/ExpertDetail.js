import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import api from "../api/axios";
import ExpertComments from "../components/experts/ExpertComments";

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await api.get(`/experts/${id}/`);
        setExpert(response.data);

        // Check if the current user is the owner
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && response.data.user.id === user.id) {
          setIsOwner(true);
        }

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "An error occurred while fetching the expert profile."
        );
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await api.post(`/experts/${id}/like/`);
      setExpert({
        ...expert,
        is_liked: response.data.is_liked,
        likes_count: response.data.likes_count,
        dislikes_count: response.data.dislikes_count,
      });
    } catch (error) {
      console.error("Error liking expert:", error);
      setError("Failed to like expert profile");
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`/experts/${id}/dislike/`);
      setExpert({
        ...expert,
        is_disliked: response.data.is_disliked,
        likes_count: response.data.likes_count,
        dislikes_count: response.data.dislikes_count,
      });
    } catch (error) {
      console.error("Error disliking expert:", error);
      setError("Failed to dislike expert profile");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
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

  if (!expert) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Expert profile not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Expert Profile</h1>
        <div>
          {isOwner && (
            <Link to={`/experts/${id}/edit`} className="me-2">
              <Button variant="primary">Edit Profile</Button>
            </Link>
          )}
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/experts")}
          >
            Back to Experts
          </Button>
        </div>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="row">
            <div className="col-md-4">
              {expert.profile_picture && (
                <img
                  src={expert.profile_picture}
                  alt={expert.name}
                  className="img-fluid rounded mb-4"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
            </div>
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="mb-3">{expert.name}</h2>
                  <p className="lead mb-4">{expert.bio}</p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant={expert.is_liked ? "primary" : "outline-primary"}
                    onClick={handleLike}
                  >
                    <FaThumbsUp className="me-1" />
                    <span>{expert.likes_count || 0}</span>
                  </Button>
                  <Button
                    variant={expert.is_disliked ? "danger" : "outline-danger"}
                    onClick={handleDislike}
                  >
                    <FaThumbsDown className="me-1" />
                    <span>{expert.dislikes_count || 0}</span>
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <h4>Expertise</h4>
                <p>{expert.expertise}</p>
              </div>

              <div className="mb-4">
                <h4>Experience</h4>
                <p>{expert.experience_years} years</p>
              </div>

              {expert.website && (
                <div className="mb-4">
                  <h4>Website</h4>
                  <p>
                    <a
                      href={expert.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {expert.website}
                    </a>
                  </p>
                </div>
              )}

              {expert.social_media && (
                <div className="mb-4">
                  <h4>Social Media</h4>
                  <p>{expert.social_media}</p>
                </div>
              )}

              <div className="mb-4">
                <h4>Rating</h4>
                <p>{expert.average_rating?.toFixed(1) || "No ratings yet"}</p>
              </div>

              <div className="mb-4">
                <h4>Views</h4>
                <p>{expert.total_views || 0}</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ExpertComments expertId={id} />
    </Container>
  );
};

export default ExpertDetail;
