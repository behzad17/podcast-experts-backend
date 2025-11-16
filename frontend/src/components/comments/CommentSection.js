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
  const [editingContent, setEditingContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/comments/`
          : `/podcasts/${id}/comments/`;
      const response = await api.get(endpoint);
      setComments(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments();
    }
  }, [fetchComments, initialComments]);

  // Helper function to update a comment in nested structure
  const updateCommentInTree = (commentsList, commentId, updater) => {
    return commentsList.map((comment) => {
      if (comment.id === commentId) {
        return updater(comment);
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updater),
        };
      }
      return comment;
    });
  };

  // Helper function to add a reply to a parent comment
  const addReplyToParent = (commentsList, parentId, newReply) => {
    return commentsList.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToParent(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  // Helper function to delete a comment from nested structure
  const deleteCommentFromTree = (commentsList, commentId) => {
    return commentsList
      .filter((comment) => comment.id !== commentId)
      .map((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: deleteCommentFromTree(comment.replies, commentId),
          };
        }
        return comment;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/add_comment/`
          : `/podcasts/${id}/comments/`;

      const data = {
        content: newComment,
        ...(replyTo && { parent: replyTo }),
      };

      const response = await api.post(endpoint, data);

      if (replyTo) {
        // Add reply to parent comment's replies array
        setComments((prev) => addReplyToParent(prev, replyTo, response.data));
      } else {
        // Add as new top-level comment
        setComments((prev) => [response.data, ...prev]);
      }

      setNewComment("");
      setReplyTo(null);
      setError("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    }
  };

  const handleEdit = async (commentId, content) => {
    try {
      let endpoint;
      let data;

      if (type === "expert") {
        endpoint = `/experts/profiles/${id}/edit_comment/`;
        data = {
          comment_id: commentId,
          content: content,
        };
      } else {
        endpoint = `/podcasts/${id}/comments/${commentId}/`;
        data = {
          content: content,
        };
      }

      const response = await api.put(endpoint, data);

      // Update comment in nested structure
      setComments((prev) =>
        updateCommentInTree(prev, commentId, () => response.data)
      );

      setEditingComment(null);
      setEditingContent("");
      setError("");
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Failed to edit comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      let endpoint;
      let data;

      if (type === "expert") {
        endpoint = `/experts/profiles/${id}/delete_comment/`;
        data = {
          comment_id: commentId,
        };
        await api.delete(endpoint, { data });
      } else {
        endpoint = `/podcasts/${id}/comments/${commentId}/`;
        await api.delete(endpoint);
      }

      // Remove comment from nested structure
      setComments((prev) => deleteCommentFromTree(prev, commentId));

      setShowDeleteModal(false);
      setError("");
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  const startEditing = (comment) => {
    setReplyTo(null); // Clear reply state when editing
    setEditingComment(comment.id);
    setEditingContent(comment.content || "");
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditingContent("");
  };

  const Comment = ({ comment, depth = 0 }) => {
    const userId =
      typeof comment.user === "object" ? comment.user?.id : comment.user;
    const username =
      typeof comment.user === "object" ? comment.user?.username : "Unknown";
    const isOwner = currentUser?.id === userId;
    const isEditing = editingComment === comment.id;
    const isReply = depth > 0;

    return (
      <div className={isReply ? "ms-4 mt-2" : "mb-3"}>
        <Card className={isReply ? "border-start border-3" : ""}>
          <Card.Body className={isReply ? "py-2" : ""}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6
                  className="mb-1"
                  style={{ fontSize: isReply ? "0.9rem" : "1rem" }}
                >
                  {username}
                </h6>
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
                    <Dropdown.Item onClick={() => startEditing(comment)}>
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
                key={`edit-form-${comment.id}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit(comment.id, editingContent);
                }}
              >
                <Form.Control
                  key={`edit-textarea-${comment.id}`}
                  as="textarea"
                  rows={3}
                  value={editingContent}
                  onChange={(e) => {
                    setEditingContent(e.target.value);
                  }}
                  className="mb-2"
                  autoFocus
                />
                <Button type="submit" size="sm" className="me-2">
                  Save
                </Button>
                <Button size="sm" variant="secondary" onClick={cancelEditing}>
                  Cancel
                </Button>
              </Form>
            ) : (
              <p
                className="mt-2 mb-0"
                style={{ fontSize: isReply ? "0.9rem" : "1rem" }}
              >
                {comment.content}
              </p>
            )}
            {!isEditing && (
              <Button
                variant="link"
                size="sm"
                className="p-0 mt-2"
                onClick={() => {
                  setReplyTo(comment.id);
                  setEditingComment(null); // Clear edit state when replying
                  setEditingContent("");
                }}
              >
                Reply
              </Button>
            )}

            {/* Render nested replies INSIDE the card */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 pt-3 border-top">
                {comment.replies.map((reply) => (
                  <Comment key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  };

  // Filter to show only top-level comments (no parent)
  const topLevelComments = comments.filter(
    (comment) => !comment.parent || comment.parent === null
  );

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
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
            <Button
              variant="secondary"
              onClick={() => {
                setReplyTo(null);
              }}
            >
              Cancel Reply
            </Button>
          )}
        </div>
      </Form>

      {loading ? (
        <div>Loading comments...</div>
      ) : (
        topLevelComments.map((comment) => (
          <Comment key={comment.id} comment={comment} depth={0} />
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
            onClick={() => handleDelete(commentToDelete.id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentSection;
