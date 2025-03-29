import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Modal,
  Dropdown,
  ListGroup,
} from "react-bootstrap";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import moment from "moment";

const CommentSection = ({ contentType, contentId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { getAuthHeaders } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/comments/?content_type=${contentType}&content_id=${contentId}`,
        getAuthHeaders()
      );
      setComments(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load comments");
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [contentType, contentId, getAuthHeaders]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/comments/",
        {
          content_type: contentType,
          content_id: contentId,
          content: newComment,
        },
        getAuthHeaders()
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      setError("Failed to post comment");
      console.error("Error posting comment:", error);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/comments/${commentId}/`,
        { content: content },
        getAuthHeaders()
      );
      setEditingComment(null);
      fetchComments();
    } catch (err) {
      setError("Failed to edit comment");
      console.error("Error editing comment:", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/comments/${commentId}/`,
        getAuthHeaders()
      );
      setShowDeleteModal(false);
      fetchComments();
    } catch (err) {
      setError("Failed to delete comment");
      console.error("Error deleting comment:", err);
    }
  };

  const Comment = ({ comment }) => {
    const [editContent, setEditContent] = useState(comment.content);
    const isOwner =
      comment.user.id === JSON.parse(localStorage.getItem("userData")).id;

    return (
      <ListGroup.Item>
        <div className="d-flex justify-content-between">
          <div>
            <strong>{comment.user.username}</strong>
            <p className="mb-0">{comment.content}</p>
          </div>
          <small className="text-muted">
            {moment(comment.timestamp).fromNow()}
          </small>
          {isOwner && (
            <Dropdown>
              <Dropdown.Toggle variant="link" size="sm">
                <FaEllipsisV />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setEditingComment(comment.id)}>
                  <FaEdit className="me-2" /> Edit
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setCommentToDelete(comment.id);
                    setShowDeleteModal(true);
                  }}
                >
                  <FaTrash className="me-2" /> Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {editingComment === comment.id ? (
          <div className="mt-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setEditingComment(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEdit(comment.id, editContent)}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => setReplyTo(comment.id)}
              className="text-decoration-none"
            >
              Reply
            </Button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="ms-4 mt-3 border-start ps-3">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </ListGroup.Item>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="mt-3">
      <Card.Header>
        <h5>Comments</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-2">
            Post Comment
          </Button>
        </Form>
        <ListGroup className="mt-3">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
          {comments.length === 0 && (
            <ListGroup.Item>No comments yet</ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(commentToDelete)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default CommentSection;
