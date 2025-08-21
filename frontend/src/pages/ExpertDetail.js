import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import CommentSection from "../components/comments/CommentSection";
import LikeButton from "../components/common/LikeButton";
import MessageButton from "../components/common/MessageButton";

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await api.get(`/experts/profiles/${id}/`);
        setExpert(response.data);

        // Check if the current user is the owner
        if (userData && userData.id === response.data.user?.id) {
          setIsOwner(true);
        }
      } catch (err) {
        setError(err.response?.data?.detail || "Error fetching expert details");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id, userData]);

  if (loading) {
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

  if (!expert) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Expert not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="expert-profile-card shadow-sm">
        <Card.Body className="p-4">
          <Row>
            <Col md={4}>
              {expert.profile_picture_url && (
                <div className="expert-profile-image position-relative">
                  <img
                    src={expert.profile_picture_url.startsWith('/') 
                      ? `http://localhost:8000${expert.profile_picture_url}` 
                      : expert.profile_picture_url}
                    alt={expert.name}
                    className="img-fluid rounded-3"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                    }}
                  />
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <LikeButton
                      itemId={expert.id}
                      type="experts/profiles"
                      initialCount={expert.likes_count}
                      className="btn-lg"
                    />
                  </div>
                </div>
              )}
            </Col>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h2 className="expert-name mb-2">{expert.name}</h2>
                  <div className="expert-tags mb-3">
                    <span className="expertise-tag">{expert.expertise}</span>
                    <span className="experience-tag">
                      {expert.experience_years} years experience
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {userData && expert.user?.id && expert.user.id !== userData.id && (
                    <MessageButton
                      targetUserId={expert.user.id}
                      targetUsername={expert.user.username}
                      targetType="expert"
                      variant="outline-success"
                      size="lg"
                    />
                  )}
                  {isOwner && (
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate(`/experts/${id}/edit`)}
                      className="edit-profile-btn"
                    >
                      <i className="fas fa-edit me-2"></i>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              <div className="expert-bio mb-4">
                <p>{expert.bio}</p>
              </div>
              <div className="expert-info-grid">
                <div className="expert-info-box">
                  <div className="info-icon">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div className="info-content">
                    <strong>Experience</strong>
                    <span>{expert.experience_years} years</span>
                  </div>
                </div>
                {expert.website && (
                  <div className="expert-info-box expert-social-links">
                    <div className="info-icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div className="info-content">
                      <strong>Website</strong>
                      <a
                        href={expert.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                {expert.social_media && (
                  <div className="expert-info-box expert-social-links">
                    <div className="info-icon">
                      <i className="fas fa-share-alt"></i>
                    </div>
                    <div className="info-content">
                      <strong>Social Media</strong>
                      <a
                        href={expert.social_media}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Connect
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="expert-comments-section mt-4 shadow-sm">
        <Card.Body>
          <div className="section-header">
            <h3>Comments</h3>
            <p className="section-subtitle">
              Share your thoughts about this expert
            </p>
          </div>
          <CommentSection
            type="expert"
            id={id}
            comments={expert.comments || []}
            currentUser={userData}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExpertDetail;
