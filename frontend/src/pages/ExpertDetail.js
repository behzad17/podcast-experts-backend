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
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "../components/comments/CommentSection";
import LikeButton from "../components/common/LikeButton";

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
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/experts/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setExpert(response.data);

        // Check if the current user is the owner
        if (userData && userData.id === response.data.user) {
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
  }, [id, navigate, userData]);

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
      <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              {expert.profile_picture && (
                <img
                  src={expert.profile_picture}
                  alt={expert.name}
                  className="img-fluid rounded"
                />
              )}
            </Col>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>{expert.name}</h2>
                  <p className="text-muted">{expert.expertise}</p>
                </div>
                <div className="d-flex gap-2">
                  <LikeButton
                    itemId={expert.id}
                    type="experts/profiles"
                    initialCount={expert.likes_count}
                  />
                  {isOwner && (
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate(`/experts/${id}/edit`)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              <p>{expert.bio}</p>
              <div className="mb-3">
                <strong>Experience:</strong> {expert.experience_years} years
              </div>
              {expert.website && (
                <div className="mb-3">
                  <strong>Website:</strong>{" "}
                  <a
                    href={expert.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {expert.website}
                  </a>
                </div>
              )}
              {expert.social_media && (
                <div className="mb-3">
                  <strong>Social Media:</strong>{" "}
                  <a
                    href={expert.social_media}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {expert.social_media}
                  </a>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h3>Comments</h3>
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
