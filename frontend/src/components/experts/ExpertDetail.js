import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import { getExpert, likeExpert, unlikeExpert } from "../../services/api";
import LikeButton from "../common/LikeButton";

const ExpertDetail = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const fetchExpert = useCallback(async () => {
    try {
      const response = await getExpert(id);
      setExpert(response.data);
      setIsLiked(response.data.is_liked || false);
    } catch (err) {
      setError("Failed to fetch expert details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchExpert();
  }, [id, fetchExpert]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeExpert(id);
      } else {
        await likeExpert(id);
      }
      fetchExpert(); // Refetch to update like count and status
    } catch (err) {
      setError("Failed to update like status.");
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!expert) return <Alert variant="warning">Expert not found</Alert>;

  // Log the expert object for debugging
  console.log("Expert API response:", expert);

  // Use correct fields with fallback
  const profilePic =
    expert.profile_picture_url ||
    expert.profile_picture ||
    expert.image ||
    "/logo192.png";
  const likesCount =
    expert.likes_count !== undefined
      ? expert.likes_count
      : expert.likes
      ? expert.likes.length
      : 0;
  const liked = expert.is_liked !== undefined ? expert.is_liked : isLiked;

  return (
    <Container className="mt-5">
      <Card>
        <Row>
          <Col md={4}>
            {profilePic && (
              <Card.Img
                src={profilePic}
                alt={expert.name}
                className="img-fluid"
              />
            )}
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title>{expert.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {expert.expertise}
              </Card.Subtitle>
              <Card.Text>{expert.bio}</Card.Text>
              <div className="d-flex align-items-center mb-2">
                <LikeButton isLiked={liked} onClick={handleLike} size="lg" />
                <span className="ms-2">{likesCount} likes</span>
              </div>
              {expert.website && (
                <a
                  href={expert.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-3"
                >
                  Visit Website
                </a>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ExpertDetail;
