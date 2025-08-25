import React, { useState, useEffect } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import api from "../../api/axios";
import {
  FaUser,
  FaUserTie,
  FaMicrophone,
  FaUsers,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user_messages/conversations/");
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "No messages yet";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return messageTime.toLocaleDateString();
  };

  const getUserAvatar = (userType) => {
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
  };

  const getUserTypeBadge = (userType) => {
    let variant = "secondary";
    if (userType === "expert") variant = "warning";
    else if (userType === "podcaster") variant = "info";

    return (
      <Badge bg={variant} className="type-badge">
        {userType.charAt(0).toUpperCase() + userType.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="conversations-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="no-conversations">
        <div className="no-conversations-icon">
          <FaEnvelope />
        </div>
        <h6 className="no-conversations-title">No conversations yet</h6>
        <p className="no-conversations-subtitle">
          Start messaging people to build your network
        </p>
      </div>
    );
  }

  return (
    <div className="conversations-list">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="conversation-item">
          <a
            href={`/messages/${conversation.user.id}`}
            className="conversation-link"
          >
            <div className="conversation-avatar">
              {getUserAvatar(conversation.user.user_type || "default")}
            </div>

            <div className="conversation-content">
              <div className="conversation-header">
                <h6 className="conversation-name">
                  {conversation.user.username}
                </h6>
                <div className="conversation-meta">
                  {getUserTypeBadge(conversation.user.user_type || "default")}
                  {conversation.unread_count > 0 && (
                    <Badge bg="danger" className="unread-badge">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="conversation-preview">
                <p className="last-message">
                  {conversation.last_message?.content || "No messages yet"}
                </p>
                <div className="message-time">
                  <FaClock className="time-icon" />
                  <span>
                    {formatLastMessageTime(
                      conversation.last_message?.timestamp
                    )}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
