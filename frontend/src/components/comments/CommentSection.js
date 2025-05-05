import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Modal,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../api/axios";
import moment from "moment";

const CommentSection = ({
  type,
  id,
  comments: initialComments = [],
  currentUser,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/comments/`
          : `/podcasts/podcasts/${id}/comments/`;
      const response = await api.get(endpoint);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError(
        error?.response?.data?.detail ||
          "Failed to load comments. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments();
    }
  }, [fetchComments, initialComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/comments/`
          : `/podcasts/podcasts/${id}/comments/`;

      const data = {
        content: newComment,
        parent: replyTo?.id,
      };

      const response = await api.post(endpoint, data);
      setComments((prev) => [...prev, response.data]);
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      setError(
        error?.response?.data?.detail ||
          "Failed to post comment. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      setLoading(true);
      setError("");
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/comments/${commentId}/`
          : `/podcasts/podcasts/${id}/comments/${commentId}/`;

      const response = await api.patch(endpoint, { content });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("Error editing comment:", error);
      setError(
        error?.response?.data?.detail ||
          "Failed to edit comment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      setLoading(true);
      setError("");
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/comments/${commentToDelete.id}/`
          : `/podcasts/podcasts/${id}/comments/${commentToDelete.id}/`;

      await api.delete(endpoint);
      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentToDelete.id)
      );
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError(
        error?.response?.data?.detail ||
          "Failed to delete comment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !comments.length) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading comments...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="comment-section">
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={isSubmitting}
          />
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {replyTo && (
            <small className="text-muted">
              Replying to {replyTo.user.username}
              <Button
                variant="link"
                className="p-0 ms-2"
                onClick={() => setReplyTo(null)}
              >
                Cancel
              </Button>
            </small>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </Form>

      <div className="comments-list">
        {comments.map((comment) => (
          <Card key={comment.id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{comment.user.username}</h6>
                  <small className="text-muted">
                    {moment(comment.created_at).fromNow()}
                  </small>
                </div>
                {currentUser?.id === comment.user.id && (
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      id={`dropdown-${comment.id}`}
                      className="p-0"
                    >
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setEditingComment(comment)}>
                        <FaEdit className="me-2" />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setCommentToDelete(comment);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
              {editingComment?.id === comment.id ? (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEdit(comment.id, editingComment.content);
                  }}
                >
                  <Form.Group className="mt-2">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={editingComment.content}
                      onChange={(e) =>
                        setEditingComment({
                          ...editingComment,
                          content: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <div className="mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingComment(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <p className="mt-2 mb-0">{comment.content}</p>
              )}
              {!replyTo && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-2"
                  onClick={() => setReplyTo(comment)}
                >
                  Reply
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentSection;
