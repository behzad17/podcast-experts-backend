import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get("/messages/conversations/");
      setConversations(Object.values(response.data));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleConversationClick = (userId) => {
    navigate(`/messages/${userId}`);
  };

  return (
    <Card>
      <Card.Header>
        <h4>Messages</h4>
      </Card.Header>
      <ListGroup variant="flush">
        {conversations.map((conversation) => (
          <ListGroup.Item
            key={conversation.user.id}
            action
            onClick={() => handleConversationClick(conversation.user.id)}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h6>{conversation.user.username}</h6>
              <small className="text-muted">
                {conversation.last_message?.content.substring(0, 50)}
                {conversation.last_message?.content.length > 50 ? "..." : ""}
              </small>
            </div>
            {conversation.unread_count > 0 && (
              <Badge bg="primary" pill>
                {conversation.unread_count}
              </Badge>
            )}
          </ListGroup.Item>
        ))}
        {conversations.length === 0 && (
          <ListGroup.Item>No conversations yet</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default MessageList;
