import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import api from "../../api/axios";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get("/user_messages/conversations/");
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <ListGroup variant="flush">
      {conversations.map((conversation) => (
        <ListGroup.Item
          key={conversation.id}
          action
          href={`/messages/${conversation.user.id}`}
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            <h6>{conversation.user.username}</h6>
            <small className="text-muted">
              {conversation.last_message?.content || "No messages yet"}
            </small>
          </div>
          {conversation.unread_count > 0 && (
            <span className="badge bg-primary rounded-pill">
              {conversation.unread_count}
            </span>
          )}
        </ListGroup.Item>
      ))}
      {conversations.length === 0 && (
        <ListGroup.Item>No conversations yet</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default MessageList;
