import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  ListGroup,
  InputGroup,
  Dropdown,
  Alert,
} from "react-bootstrap";
import { FaSearch, FaSort, FaTimes } from "react-icons/fa";
import api from "../api/axios";

const Comments = ({ entityType, entityId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [commentSort, setCommentSort] = useState("newest");
  const [filteredComments, setFilteredComments] = useState([]);

  useEffect(() => {
    if (entityId) {
      fetchComments();
    }
  }, [entityId]);

  useEffect(() => {
    if (comments.length > 0) {
      setFilteredComments(
        comments.filter((comment) =>
          comment.content.toLowerCase().includes(commentSearch.toLowerCase())
        )
      );
    }
  }, [comments, commentSearch]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/${entityType}/${entityId}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/${entityType}/${entityId}/comments/`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    }
  };

  const sortComments = (comments) => {
    switch (commentSort) {
      case "newest":
        return [...comments].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "oldest":
        return [...comments].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "most_liked":
        return [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return comments;
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Post Comment
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="mb-0">
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search comments..."
              value={commentSearch}
              onChange={(e) => setCommentSearch(e.target.value)}
            />
            {commentSearch && (
              <Button
                variant="outline-secondary"
                onClick={() => setCommentSearch("")}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Form.Group>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary">
            <FaSort className="me-2" /> Sort By
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setCommentSort("newest")}>
              Newest First
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setCommentSort("oldest")}>
              Oldest First
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setCommentSort("most_liked")}>
              Most Liked
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="text-center py-4 text-muted">
          {commentSearch
            ? "No comments match your search."
            : "No comments yet. Be the first to comment!"}
        </div>
      ) : (
        <ListGroup>
          {sortComments(filteredComments).map((comment) => (
            <ListGroup.Item key={comment.id}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{comment.user?.username || "Anonymous"}</strong>
                  <small className="text-muted ms-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </small>
                </div>
                <small className="text-muted">{comment.likes || 0} likes</small>
              </div>
              <p className="mb-0 mt-2">{comment.content}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Comments;
