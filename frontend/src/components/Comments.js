import React, { useState, useEffect, useCallback } from "react";
import { Card, Form, Button, Badge } from "react-bootstrap";
import {
  FaTrash,
  FaReply,
  FaEdit,
  FaSave,
  FaTimes,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const CommentItem = ({
  comment,
  onDelete,
  onReply,
  onEdit,
  onLike,
  onDislike,
  user,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.text);
  const [error, setError] = useState("");
  const isOwner = user?.id === comment.user?.id;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    } catch (error) {
      setError("Failed to post reply");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      await onEdit(comment.id, editText);
      setShowEditForm(false);
    } catch (error) {
      setError("Failed to edit comment");
    }
  };

  const handleLike = async () => {
    try {
      await onLike(comment.id);
    } catch (error) {
      setError("Failed to like comment");
    }
  };

  const handleDislike = async () => {
    try {
      await onDislike(comment.id);
    } catch (error) {
      setError("Failed to dislike comment");
    }
  };

  return (
    <div className="comment-item mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-2">
            <Badge bg="primary" className="me-2">
              {comment.user?.username || "Anonymous"}
            </Badge>
            <small className="text-muted">
              {new Date(comment.created_at).toLocaleString()}
            </small>
          </div>
          {showEditForm ? (
            <Form onSubmit={handleEdit}>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex gap-2 mt-2">
                <Button type="submit" size="sm" variant="success">
                  <FaSave className="me-1" /> Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditText(comment.text);
                  }}
                >
                  <FaTimes className="me-1" /> Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <p className="mb-2">{comment.text}</p>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="replies ms-4 mt-2">
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="reply-item mb-2 p-2 bg-light rounded"
                >
                  <div className="d-flex align-items-center mb-1">
                    <Badge bg="secondary" className="me-2">
                      {reply.user?.username || "Anonymous"}
                    </Badge>
                    <small className="text-muted">
                      {new Date(reply.created_at).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-0">{reply.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="comment-actions">
          {isOwner && (
            <>
              <Button
                variant="outline-danger"
                size="sm"
                className="me-2"
                onClick={() => onDelete(comment.id)}
              >
                <FaTrash />
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => setShowEditForm(!showEditForm)}
              >
                <FaEdit />
              </Button>
            </>
          )}
          <Button
            variant={comment.is_liked ? "primary" : "outline-primary"}
            size="sm"
            className="me-2"
            onClick={handleLike}
          >
            <FaThumbsUp className="me-1" />
            {comment.likes_count}
          </Button>
          <Button
            variant={comment.is_disliked ? "danger" : "outline-danger"}
            size="sm"
            className="me-2"
            onClick={handleDislike}
          >
            <FaThumbsDown className="me-1" />
            {comment.dislikes_count}
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <FaReply />
          </Button>
        </div>
      </div>

      {showReplyForm && (
        <Form onSubmit={handleReply} className="mt-2 ms-4">
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex gap-2 mt-2">
            <Button type="submit" size="sm">
              Reply
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </Button>
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
        </Form>
      )}
    </div>
  );
};

const Comments = ({ podcastId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/?podcast=${podcastId}`);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
      setComments([]);
    }
  }, [podcastId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post("/comments/", {
        podcast: podcastId,
        text: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}/`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment");
    }
  };

  const handleEdit = async (commentId, newText) => {
    try {
      const response = await api.patch(`/comments/${commentId}/`, {
        text: newText,
      });
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, text: newText } : comment
        )
      );
      return response.data;
    } catch (error) {
      console.error("Error editing comment:", error);
      throw error;
    }
  };

  const handleReply = async (commentId, replyText) => {
    try {
      const response = await api.post("/comments/", {
        podcast: podcastId,
        text: replyText,
        parent: commentId,
      });
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), response.data],
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error posting reply:", error);
      throw error;
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like/`);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                is_liked: response.data.is_liked,
                likes_count: response.data.likes_count,
                dislikes_count: response.data.dislikes_count,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      throw error;
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/dislike/`);
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                is_disliked: response.data.is_disliked,
                likes_count: response.data.likes_count,
                dislikes_count: response.data.dislikes_count,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
      throw error;
    }
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title className="mb-4">Comments</Card.Title>

        {user ? (
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
        ) : (
          <p className="text-muted">Please log in to leave a comment</p>
        )}

        {error && <div className="text-danger mb-3">{error}</div>}

        <div className="comments-list">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onReply={handleReply}
                onLike={handleLike}
                onDislike={handleDislike}
                user={user}
              />
            ))
          ) : (
            <p className="text-muted">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Comments;
