import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import CollaborationRequest from "../components/CollaborationRequest";
import LikeButton from "../components/LikeButton";
import BookmarkButton from "../components/BookmarkButton";

const ExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpert();
  }, [id]);

  const fetchExpert = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/experts/${id}/`);
      setExpert(response.data);
    } catch (error) {
      console.error("Error fetching expert:", error);
      setError("Failed to load expert profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/comments/`, {
        expert: id,
        text: comment,
      });
      setSuccess("Comment added successfully");
      setComment("");
      fetchExpert(); // Refresh the expert data to show new comment
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment");
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4">
        <h2>Loading expert profile...</h2>
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
        <Alert variant="warning">Expert not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{expert.name}</Card.Title>
          <Card.Text>{expert.specialty}</Card.Text>
          <Card.Text>{expert.bio}</Card.Text>
          <CollaborationRequest expertId={expert.id} />
          <LikeButton expertId={expert.id} />
          <BookmarkButton expertId={expert.id} />
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h3>Comments</h3>
          {expert.comments?.map((comment) => (
            <div key={comment.id} className="mb-3">
              <p>{comment.text}</p>
              <small className="text-muted">
                By {comment.user.username} on{" "}
                {new Date(comment.created_at).toLocaleDateString()}
              </small>
            </div>
          ))}

          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Add a Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">Submit Comment</Button>
          </Form>
        </Card.Body>
      </Card>
      {success && <Alert variant="success">{success}</Alert>}
    </Container>
  );
};

export default ExpertProfile;
