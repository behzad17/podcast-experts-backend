import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const { currentUser, getAuthHeaders } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/messages/chat_with_user/?user_id=${userId}`,
        getAuthHeaders()
      );
      setMessages(response.data.messages);
      setOtherUser(response.data.other_user);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [userId, getAuthHeaders]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/messages/",
        {
          receiver_id: userId,
          content: newMessage,
        },
        getAuthHeaders()
      );
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="h-100">
      <Card.Header>
        <h4>{otherUser?.username || "Chat"}</h4>
      </Card.Header>
      <Card.Body className="d-flex flex-column" style={{ height: "500px" }}>
        <div className="flex-grow-1 overflow-auto mb-3">
          <ListGroup variant="flush">
            {messages.map((message) => (
              <ListGroup.Item
                key={message.id}
                className={`border-0 ${
                  message.sender.id === currentUser.id ? "text-end" : ""
                }`}
              >
                <div
                  className={`d-inline-block p-2 rounded ${
                    message.sender.id === currentUser.id
                      ? "bg-primary text-white"
                      : "bg-light"
                  }`}
                  style={{ maxWidth: "75%", textAlign: "left" }}
                >
                  <div>{message.content}</div>
                  <small className="text-muted">
                    {formatTimestamp(message.timestamp)}
                  </small>
                </div>
              </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
          </ListGroup>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="me-2"
            />
            <Button type="submit" variant="primary">
              Send
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatWindow;
