import React, { useEffect, useState } from "react";
import { Container, ListGroup, Badge } from "react-bootstrap";
import { getMessages } from "../../services/api";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch messages");
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container className="my-4">
      <h2 className="mb-4">Messages</h2>
      <ListGroup>
        {messages.map((message) => (
          <ListGroup.Item key={message.id} className="mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">
                  From: {message.sender_name} → To: {message.receiver_name}
                </h5>
                <p className="mb-1">{message.content}</p>
                <small className="text-muted">
                  {new Date(message.timestamp).toLocaleString()}
                </small>
              </div>
              {!message.is_read && (
                <Badge bg="primary" pill>
                  New
                </Badge>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MessageList;
