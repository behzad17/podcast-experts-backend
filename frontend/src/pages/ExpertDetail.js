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
import ReactionButton from "../components/common/ReactionButton";

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [reactions, setReactions] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("userData"));

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
        const userResponse = await axios.get(
          "http://localhost:8000/api/users/me/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsOwner(response.data.user === userResponse.data.id);

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
  }, [id, navigate]);

  useEffect(() => {
    if (expert) {
      fetchReactions();
    }
  }, [expert]);

  const fetchReactions = async () => {
    try {
      const response = await axios.get(`/experts/${expert.id}/reactions/`);
      setReactions(response.data);
    } catch (err) {
      console.error("Error fetching reactions:", err);
    }
  };

  const getCurrentUserReaction = () => {
    if (!currentUser) return null;
    return reactions.find((r) => r.user === currentUser.id);
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

      <Card className="shadow-sm">
        <Card.Body>
          <div className="row">
            <div className="col-md-4">
              {expert.profile_picture && (
                <img
                  src={expert.profile_picture}
                  alt={expert.name}
                  className="img-fluid rounded mb-4"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              )}
            </div>
            <div className="col-md-8">
              <h2 className="mb-3">{expert.name}</h2>
              <p className="lead mb-4">{expert.bio}</p>

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
                <ReactionButton
                  type="expert"
                  id={expert.id}
                  initialReaction={getCurrentUserReaction()}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Add Comment Section */}
      <CommentSection type="expert" id={expert.id} />
    </Container>
  );
};

export default ExpertDetail;
