import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Alert, Modal, Dropdown } from "react-bootstrap";
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

  const fetchComments = async () => {
    try {
      const response = await api.get(
        type === "podcast"
          ? `/podcasts/${id}/comments/`
          : `/experts/${id}/comments/`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    }
  };

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments();
    }
  }, [fetchComments, initialComments]);

  const handleAddComment = async (content, parentId = null) => {
    try {
      const response = await api.post(
        type === "podcast"
          ? `/podcasts/${id}/comments/`
          : `/experts/${id}/comments/`,
        { content, parent: parentId }
      );
      setComments([...comments, response.data]);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment");
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      const response = await api.put(
        type === "podcast"
          ? `/podcasts/${id}/comments/${commentId}/`
          : `/experts/${id}/comments/${commentId}/`,
        { content }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Failed to edit comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(
        type === "podcast"
          ? `/podcasts/${id}/comments/${commentId}/`
          : `/experts/${id}/comments/${commentId}/`
      );
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  const Comment = ({ comment }) => {
    const isOwner = currentUser?.id === comment.user.id;
    const isEditing = editingComment === comment.id;

    return (
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-1">{comment.user.username}</h6>
              <small className="text-muted">
                {moment(comment.created_at).fromNow()}
              </small>
            </div>
            {isOwner && (
              <Dropdown>
                <Dropdown.Toggle variant="link" id={`dropdown-${comment.id}`}>
                  <FaEllipsisV />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setEditingComment(comment.id)}>
                    <FaEdit /> Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setCommentToDelete(comment);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash /> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          {isEditing ? (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditComment(comment.id, newComment);
              }}
            >
              <Form.Control
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
              />
              <Button type="submit" size="sm" className="me-2">
                Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditingComment(null)}
              >
                Cancel
              </Button>
            </Form>
          ) : (
            <p className="mt-2 mb-0">{comment.content}</p>
          )}
          <Button
            variant="link"
            size="sm"
            className="p-0 mt-2"
            onClick={() => setReplyTo(comment.id)}
          >
            Reply
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleAddComment} className="mb-4">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" disabled={!newComment.trim()}>
            {replyTo ? "Reply" : "Comment"}
          </Button>
          {replyTo && (
            <Button variant="secondary" onClick={() => setReplyTo(null)}>
              Cancel Reply
            </Button>
          )}
        </div>
      </Form>

      {loading ? (
        <div>Loading comments...</div>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteComment(commentToDelete.id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentSection;
