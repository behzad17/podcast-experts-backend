import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Alert, Modal, Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../api/axios";
import moment from "moment";

const CommentSection = ({ type, id }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("userData"));

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/podcasts/podcasts/${id}/comments/`);
      setComments(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = replyTo
        ? `/podcasts/podcasts/${id}/reply_comment/`
        : `/podcasts/podcasts/${id}/add_comment/`;

      const data = {
        content: newComment,
        ...(replyTo && { parent: replyTo }),
      };

      await api.post(endpoint, data);
      setNewComment("");
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      setError("Failed to post comment");
      console.error("Error posting comment:", err);
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      await api.patch(`/podcasts/podcasts/${id}/edit_comment/`, {
        comment_id: commentId,
        content: content,
      });
      setEditingComment(null);
      fetchComments();
    } catch (err) {
      setError("Failed to edit comment");
      console.error("Error editing comment:", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/podcasts/podcasts/${id}/delete_comment/`, {
        data: { comment_id: commentId },
      });
      setShowDeleteModal(false);
      fetchComments();
    } catch (err) {
      setError("Failed to delete comment");
      console.error("Error deleting comment:", err);
    }
  };

  const Comment = ({ comment }) => {
    const [editContent, setEditContent] = useState(comment.content);
    const isOwner = currentUser && comment.user.id === currentUser.id;

    return (
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
              {comment.user.profile_picture && (
                <img
                  src={comment.user.profile_picture}
                  alt={comment.user.username}
                  className="rounded-circle me-2"
                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                />
              )}
              <div>
                <strong>{comment.user.username}</strong>
                <small className="text-muted ms-2">
                  {moment(comment.created_at).fromNow()}
                </small>
              </div>
            </div>
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
            <Card.Text className="mt-2">{comment.content}</Card.Text>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => setReplyTo(comment.id)}
              className="text-decoration-none"
            >
              Reply
            </Button>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="ms-4 mt-3 border-start ps-3">
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="mt-4">
      <h4 className="mb-4">Comments</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
            className="shadow-sm"
          />
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {replyTo && (
            <Button
              variant="link"
              onClick={() => setReplyTo(null)}
              className="text-decoration-none"
            >
              Cancel Reply
            </Button>
          )}
          <Button type="submit" variant="primary" disabled={!newComment.trim()}>
            {replyTo ? "Post Reply" : "Post Comment"}
          </Button>
        </div>
      </Form>

      <div>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )}
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
    </div>
  );
};

export default CommentSection;
