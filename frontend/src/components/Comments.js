import React, { useState, useEffect } from "react";
import { Card, Form, Button, ListGroup, Alert, Badge } from "react-bootstrap";
import api from "../api/axios";

const Comments = ({ type, id }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [type, id]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const tokenData = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser(tokenData);
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/${type}/${id}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/${type}/${id}/comments/`, {
        content: newComment.trim(),
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment. Please try again.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/${type}/${id}/comments/${commentId}/`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">Comments</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {currentUser ? (
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">
              Post Comment
            </Button>
          </Form>
        ) : (
          <Alert variant="info">
            Please <a href="/login">login</a> to leave a comment.
          </Alert>
        )}

        <ListGroup>
          {comments.map((comment) => (
            <ListGroup.Item key={comment.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{comment.user_name}</h6>
                  <p className="mb-1">{comment.content}</p>
                  <small className="text-muted">
                    {new Date(comment.created_at).toLocaleString()}
                  </small>
                </div>
                {currentUser && comment.user_id === currentUser.user_id && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </ListGroup.Item>
          ))}
          {comments.length === 0 && (
            <ListGroup.Item>
              <p className="text-muted mb-0">
                No comments yet. Be the first to comment!
              </p>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Comments;
