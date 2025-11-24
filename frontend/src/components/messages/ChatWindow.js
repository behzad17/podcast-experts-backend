import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, Button, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaUserTie,
  FaMicrophone,
  FaUsers,
  FaPaperPlane,
  FaClock,
  FaEllipsisV,
} from "react-icons/fa";

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const MIN_MESSAGE_LENGTH = 2;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await api.get(
        `/user_messages/chat_with_user/?user_id=${userId}`
      );
      setMessages(response.data.messages || []);
      setOtherUser(response.data.other_user);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch and polling setup
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchMessages();

      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when component mounts or userId changes
  useEffect(() => {
    if (userId && inputRef.current) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userId]);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!userId || isSubmitting) return;

      // Validate message
      const validationError = validateMessage(newMessage);
      if (validationError) {
        setMessageError(validationError);
        toast.error(validationError);
        return;
      }

      setMessageError("");

      try {
        setIsSubmitting(true);
        await api.post("/user_messages/", {
          receiver_id: userId,
          content: newMessage.trim(),
        });

        // Clear input immediately for better UX
        setNewMessage("");

        // Refetch messages to show the new message
        await fetchMessages();

        // Show success toast
        toast.success("Message sent successfully");

        // Refocus input after sending
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMsg = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        "Failed to send message. Please try again.";
        toast.error(errorMsg);
        // Keep the message in input if sending failed
      } finally {
        setIsSubmitting(false);
      }
    },
    [newMessage, userId, isSubmitting, fetchMessages]
  );

  const handleInputChange = useCallback((e) => {
    setNewMessage(e.target.value);
    // Clear error when user starts typing
    if (messageError) {
      setMessageError("");
    }
  }, [messageError]);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return messageTime.toLocaleDateString();
  }, []);

  const getUserAvatar = useCallback((userType) => {
    switch (userType) {
      case "expert":
        return <FaUserTie className="avatar-icon expert" />;
      case "podcaster":
        return <FaMicrophone className="avatar-icon podcaster" />;
      case "listener":
        return <FaUsers className="avatar-icon listener" />;
      default:
        return <FaUser className="avatar-icon default" />;
    }
  }, []);

  const getUserTypeBadge = useCallback((userType) => {
    let variant = "secondary";
    if (userType === "expert") variant = "warning";
    else if (userType === "podcaster") variant = "info";

    return (
      <Badge bg={variant} className="type-badge">
        {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </Badge>
    );
  }, []);

  if (!userId) {
    return (
      <div className="welcome-chat">
        <div className="welcome-content">
          <div className="welcome-icon">
            <FaUser />
          </div>
          <h3 className="welcome-title">Welcome to Messages</h3>
          <p className="welcome-subtitle">
            Select a conversation from the left sidebar to start chatting, or
            search for new people to connect with.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="chat-window-modern">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">
            {getUserAvatar(otherUser?.user_type || "default")}
          </div>
          <div className="user-details">
            <h5 className="user-name">{otherUser?.username || "Chat"}</h5>
            <div className="user-meta">
              {getUserTypeBadge(otherUser?.user_type || "default")}
              <span className="status-indicator online">Online</span>
            </div>
          </div>
        </div>
        <div className="chat-actions">
          <Button variant="outline-secondary" size="sm" className="action-btn">
            <FaEllipsisV />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">
              <FaUser />
            </div>
            <h6>No messages yet</h6>
            <p>Start the conversation by sending a message!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${
                  message.sender?.id === currentUser?.id ? "sent" : "received"
                }`}
              >
                {message.sender?.id !== currentUser?.id && (
                  <div className="message-avatar">
                    {getUserAvatar(otherUser?.user_type || "default")}
                  </div>
                )}

                <div className="message-content">
                  <div className="message-bubble">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      <FaClock className="time-icon" />
                      <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input-area">
        <Form onSubmit={handleSubmit} className="message-form">
          <Form.Group className="input-group">
            <Form.Control
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="message-input"
              disabled={isSubmitting}
              isInvalid={!!messageError}
            />
            {messageError && (
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {messageError}
              </Form.Control.Feedback>
            )}
            <Button
              type="submit"
              variant="primary"
              className="send-btn"
              disabled={!newMessage.trim() || newMessage.trim().length < MIN_MESSAGE_LENGTH || isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Sending...</span>
                </div>
              ) : (
                <FaPaperPlane />
              )}
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default ChatWindow;
