import React, { useState, useEffect } from "react";
import { Form, Button, Card, Badge } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import api from "../../api/axios";

const ExpertComments = ({ expertId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [expertId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/experts/${expertId}/`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/experts/${expertId}/add_comment/`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like/`);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes_count: response.data.likes_count }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      setError("Failed to like comment");
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/dislike/`);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, dislikes_count: response.data.dislikes_count }
            : comment
        )
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
      setError("Failed to dislike comment");
    }
  };

  return (
    <div className="mt-4">
      <h3>Comments</h3>
      {error && <div className="text-danger mb-3">{error}</div>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !newComment.trim()}
          className="mt-2"
        >
          Post Comment
        </Button>
      </Form>

      {comments.map((comment) => (
        <Card key={comment.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{comment.user.username}</h6>
                <p className="mb-1">{comment.content}</p>
                <small className="text-muted">
                  {new Date(comment.created_at).toLocaleDateString()}
                </small>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleLike(comment.id)}
                >
                  <FaThumbsUp className="me-1" />
                  <Badge bg="primary">{comment.likes_count || 0}</Badge>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDislike(comment.id)}
                >
                  <FaThumbsDown className="me-1" />
                  <Badge bg="danger">{comment.dislikes_count || 0}</Badge>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ExpertComments;
