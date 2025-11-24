import React, { useState } from "react";
import { Button, Modal, Form, Alert, Badge } from "react-bootstrap";
import { FaEnvelope, FaPaperPlane, FaTimes } from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "./MessageButton.css";

const MessageButton = ({
  targetUserId,
  targetUsername,
  targetType = "user", // 'podcaster', 'expert', or 'user'
  variant = "outline-primary",
  size = "sm",
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const MIN_MESSAGE_LENGTH = 2;

  const validateMessage = (content) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return "Message cannot be empty";
    }
    if (trimmed.length < MIN_MESSAGE_LENGTH) {
      return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate message
    const validationError = validateMessage(message);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/user_messages/", {
        receiver_id: targetUserId,
        content: message.trim(),
      });

      toast.success("Message sent successfully");
      setSuccess(true);
      setMessage("");

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = error.response?.data?.detail || 
                     error.response?.data?.message || 
                     "Failed to send message. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setMessage("");
    setError("");
    setSuccess(false);
  };

  const getButtonText = () => {
    switch (targetType) {
      case "podcaster":
        return "Message Podcaster";
      case "expert":
        return "Message Expert";
      default:
        return "Send Message";
    }
  };

  const getModalTitle = () => {
    switch (targetType) {
      case "podcaster":
        return `Send Message to ${targetUsername}`;
      case "expert":
        return `Send Message to ${targetUsername}`;
      default:
        return `Send Message to ${targetUsername}`;
    }
  };

  const getButtonIcon = () => {
    if (success) return <FaPaperPlane className="me-1" />;
    return <FaEnvelope className="me-1" />;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`message-btn ${className}`}
        onClick={() => setShowModal(true)}
        title={getButtonText()}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="lg"
        className="message-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center">
            <FaEnvelope className="me-2 text-primary" />
            {getModalTitle()}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-3">
          {success ? (
            <div className="text-center py-4">
              <div className="mb-3">
                <FaPaperPlane
                  className="text-success"
                  style={{ fontSize: "3rem" }}
                />
              </div>
              <Alert variant="success" className="border-0">
                <h5 className="mb-2">Message Sent Successfully!</h5>
                <p className="mb-0 text-muted">
                  Your message has been delivered to {targetUsername}. The modal
                  will close automatically.
                </p>
              </Alert>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger" className="mb-3 border-0">
                  <FaTimes className="me-2" />
                  {error}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Message to {targetUsername}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    // Clear error when user starts typing
                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder={`Type your message to ${targetUsername}...\n\nYou can ask questions, request collaboration, or simply introduce yourself.`}
                  maxLength={1000}
                  disabled={isLoading}
                  className="message-textarea"
                  isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <Form.Text className="text-muted">
                    <small>
                      <FaEnvelope className="me-1" />
                      This message will be sent privately to {targetUsername}
                    </small>
                  </Form.Text>
                  <Badge
                    bg={message.length > 800 ? "warning" : "secondary"}
                    className="character-count"
                  >
                    {message.length}/1000
                  </Badge>
                </div>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        {!success && (
          <Modal.Footer className="border-0 pt-0">
            <Button
              variant="light"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading || !message.trim() || message.trim().length < MIN_MESSAGE_LENGTH}
              className="px-4 send-message-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane className="me-2" />
                  Send Message
                </>
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default MessageButton;
