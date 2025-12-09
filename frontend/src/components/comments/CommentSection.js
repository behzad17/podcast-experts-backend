import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Form, Button, Card, Alert, Modal, Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-toastify";
import moment from "moment";

// Move Comment component outside to prevent recreation on every render
// Custom comparison function: only re-render if props relevant to THIS comment change
const Comment = React.memo(
  ({
    comment,
    depth = 0,
    currentUser,
    editingComment,
    editingContent,
    editError,
    editTextareaRefs,
    onStartEditing,
    onCancelEditing,
    onEditSubmit,
    onEditChange,
    onDelete,
    onReply,
    MIN_COMMENT_LENGTH,
  }) => {
    const userId =
      typeof comment.user === "object" ? comment.user?.id : comment.user;
    const username =
      typeof comment.user === "object" ? comment.user?.username : "Unknown";
    const isOwner = currentUser?.id === userId;
    const isEditing = editingComment === comment.id;
    const isReply = depth > 0;

    // Stable ref callback - editTextareaRefs is a ref object (stable), included for linter
    const setTextareaRef = useCallback(
      (element) => {
        if (element) {
          editTextareaRefs.current[comment.id] = element;
        } else {
          delete editTextareaRefs.current[comment.id];
        }
      },
      [comment.id, editTextareaRefs] // editTextareaRefs is stable, but included for linter
    );

    // Focus textarea only when editing STARTS for THIS comment (not on every render)
    const prevIsEditingRef = useRef(false);
    useEffect(() => {
      // Only focus when transitioning from not editing to editing
      if (isEditing && !prevIsEditingRef.current) {
        const textarea = editTextareaRefs.current[comment.id];
        if (textarea) {
          // Use setTimeout to ensure DOM is fully ready
          const timeoutId = setTimeout(() => {
            if (textarea) {
              const length = textarea.value.length;
              textarea.focus();
              textarea.setSelectionRange(length, length);
            }
          }, 0);
          return () => clearTimeout(timeoutId);
        }
      }
      prevIsEditingRef.current = isEditing;
    }, [isEditing, comment.id, editTextareaRefs]);

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
                    <Dropdown.Item onClick={() => onStartEditing(comment)}>
                      <FaEdit /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(comment)}>
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
                  onEditSubmit(comment.id);
                }}
              >
                <Form.Control
                  ref={setTextareaRef}
                  as="textarea"
                  rows={3}
                  value={editingContent || ""}
                  onChange={(e) => {
                    const textarea = e.target;
                    // Preserve cursor position before state update
                    const cursorPosition = textarea.selectionStart;
                    const value = e.target.value;

                    // Update state
                    onEditChange(value);

                    // Restore cursor position after React re-renders
                    // Use requestAnimationFrame to ensure DOM is updated
                    requestAnimationFrame(() => {
                      const currentTextarea =
                        editTextareaRefs.current[comment.id];
                      if (currentTextarea && currentTextarea === textarea) {
                        // Calculate new cursor position (handle text insertion/deletion)
                        const newPosition = Math.min(
                          cursorPosition,
                          value.length
                        );
                        currentTextarea.setSelectionRange(
                          newPosition,
                          newPosition
                        );
                      }
                    });
                  }}
                  isInvalid={!!editError}
                  className="mb-2"
                />
                <Form.Control.Feedback type="invalid">
                  {editError}
                </Form.Control.Feedback>
                <div className="mt-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="me-2"
                    disabled={
                      !editingContent.trim() ||
                      editingContent.trim().length < MIN_COMMENT_LENGTH
                    }
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      onCancelEditing();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
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
                  onReply(comment.id);
                }}
              >
                Reply
              </Button>
            )}

            {/* Render nested replies INSIDE the card */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 pt-3 border-top">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    currentUser={currentUser}
                    editingComment={editingComment}
                    editingContent={editingContent}
                    editError={editError}
                    editTextareaRefs={editTextareaRefs}
                    onStartEditing={onStartEditing}
                    onCancelEditing={onCancelEditing}
                    onEditSubmit={onEditSubmit}
                    onEditChange={onEditChange}
                    onDelete={onDelete}
                    onReply={onReply}
                    MIN_COMMENT_LENGTH={MIN_COMMENT_LENGTH}
                  />
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  },
  // Custom comparison: only re-render if props relevant to THIS specific comment change
  (prevProps, nextProps) => {
    // If comment data changed, re-render
    if (
      prevProps.comment.id !== nextProps.comment.id ||
      prevProps.comment.content !== nextProps.comment.content ||
      prevProps.comment.user !== nextProps.comment.user
    ) {
      return false; // Re-render
    }

    // If this comment is being edited, re-render when editingContent changes
    const isEditing = nextProps.editingComment === nextProps.comment.id;
    if (isEditing) {
      if (
        prevProps.editingContent !== nextProps.editingContent ||
        prevProps.editingComment !== nextProps.editingComment ||
        prevProps.editError !== nextProps.editError
      ) {
        return false; // Re-render
      }
    } else {
      // If not editing, ignore editingContent changes
      if (prevProps.editingComment !== nextProps.editingComment) {
        return false; // Re-render (to show/hide edit form)
      }
    }

    // If currentUser changed, re-render (affects ownership)
    if (prevProps.currentUser?.id !== nextProps.currentUser?.id) {
      return false; // Re-render
    }

    // Otherwise, skip re-render
    return true; // Don't re-render
  }
);

Comment.displayName = "Comment";

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
  const [commentError, setCommentError] = useState("");
  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Use a ref object to store refs for each comment's textarea
  const editTextareaRefs = useRef({});

  const MIN_COMMENT_LENGTH = 3;

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

  // Track if we've initialized from props to avoid overwriting local state
  const hasInitializedRef = useRef(false);

  // Initialize comments from props on mount or when they change significantly
  useEffect(() => {
    if (initialComments.length > 0 && !hasInitializedRef.current) {
      setComments(initialComments);
      hasInitializedRef.current = true;
    }
  }, [initialComments]);

  // Only fetch if we don't have initial comments
  useEffect(() => {
    if (initialComments.length === 0 && !hasInitializedRef.current) {
      fetchComments();
      hasInitializedRef.current = true;
    }
  }, [fetchComments, initialComments.length]);

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

  const validateComment = (content) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return "Comment cannot be empty";
    }
    if (trimmed.length < MIN_COMMENT_LENGTH) {
      return `Comment must be at least ${MIN_COMMENT_LENGTH} characters`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate comment
    const validationError = validateComment(newComment);
    if (validationError) {
      setCommentError(validationError);
      toast.error(validationError);
      return;
    }

    setCommentError("");
    setError("");

    try {
      const endpoint =
        type === "expert"
          ? `/experts/profiles/${id}/add_comment/`
          : `/podcasts/${id}/comments/`;

      const data = {
        content: newComment.trim(),
        ...(replyTo && { parent: replyTo }),
      };

      const response = await api.post(endpoint, data);

      if (replyTo) {
        // Add reply to parent comment's replies array
        setComments((prev) => addReplyToParent(prev, replyTo, response.data));
        toast.success("Reply posted successfully");
      } else {
        // Add as new top-level comment
        setComments((prev) => [response.data, ...prev]);
        toast.success("Comment posted successfully");
      }

      setNewComment("");
      setReplyTo(null);
      setError("");
    } catch (error) {
      console.error("Error posting comment:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to post comment";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleEditChange = useCallback(
    (value) => {
      setEditingContent(value);
      if (editError) {
        setEditError("");
      }
    },
    [editError]
  );

  const handleEditSubmit = async (commentId) => {
    const contentToSave = editingContent;

    // Validate edited comment
    const validationError = validateComment(contentToSave);
    if (validationError) {
      setEditError(validationError);
      toast.error(validationError);
      return;
    }

    setEditError("");
    setError("");

    try {
      let endpoint;
      let data;

      if (type === "expert") {
        endpoint = `/experts/profiles/${id}/edit_comment/`;
        data = {
          comment_id: commentId,
          content: contentToSave.trim(),
        };
      } else {
        endpoint = `/podcasts/${id}/comments/${commentId}/`;
        data = {
          content: contentToSave.trim(),
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
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error editing comment:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to edit comment";
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to delete comment";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const startEditing = useCallback((comment) => {
    setReplyTo(null); // Clear reply state when editing
    setEditingComment(comment.id);
    setEditingContent(comment.content || "");
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingComment(null);
    setEditingContent("");
    setEditError("");
  }, []);

  const handleReply = useCallback((commentId) => {
    setReplyTo(commentId);
    setEditingComment(null); // Clear edit state when replying
    setEditingContent("");
  }, []);

  const handleDeleteClick = useCallback((comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  }, []);

  // Filter to show only top-level comments (no parent)
  const topLevelComments = useMemo(() => {
    return comments.filter(
      (comment) => !comment.parent || comment.parent === null
    );
  }, [comments]);

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
            onChange={(e) => {
              setNewComment(e.target.value);
              // Clear error when user starts typing
              if (commentError) {
                setCommentError("");
              }
            }}
            isInvalid={!!commentError}
            className="mb-2"
          />
          <Form.Control.Feedback type="invalid">
            {commentError}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex gap-2">
          <Button
            type="submit"
            disabled={
              !newComment.trim() ||
              newComment.trim().length < MIN_COMMENT_LENGTH
            }
          >
            {replyTo ? "Reply" : "Comment"}
          </Button>
          {replyTo && (
            <Button
              variant="secondary"
              onClick={() => {
                setReplyTo(null);
                setCommentError("");
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
          <Comment
            key={comment.id}
            comment={comment}
            depth={0}
            currentUser={currentUser}
            editingComment={editingComment}
            editingContent={editingContent}
            editError={editError}
            editTextareaRefs={editTextareaRefs}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onEditSubmit={handleEditSubmit}
            onEditChange={handleEditChange}
            onDelete={handleDeleteClick}
            onReply={handleReply}
            MIN_COMMENT_LENGTH={MIN_COMMENT_LENGTH}
          />
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
