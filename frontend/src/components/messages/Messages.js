import React, { useEffect, useState } from "react";
import { getUsers, sendMessage, api } from "../../services/api";
import {
  Card,
  Spinner,
  Alert,
  Container,
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  InputGroup,
} from "react-bootstrap";

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userSearch, setUserSearch] = useState("");

  // Fetch all users for new message
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        const userList = Array.isArray(res.data)
          ? res.data
          : res.data.results || res.data.users || [];
        setUsers(userList);
      } catch (err) {
        setError("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  // Fetch conversations (users you've messaged)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/messages/conversations/");
        setConversations(res.data);
      } catch (err) {
        // ignore for now
      }
    };
    fetchConversations();
  }, [success]);

  // Fetch conversation with selected user
  useEffect(() => {
    if (!selectedUser) return;
    const fetchConversation = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(
          `/messages/chat_with_user/?user_id=${selectedUser}`
        );
        setConversation(res.data.messages);
      } catch (err) {
        setError("Failed to load conversation.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [selectedUser, success]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setError(null);
    try {
      await sendMessage(selectedUser, message);
      setMessage("");
      setSuccess(Date.now()); // trigger conversation reload
    } catch (err) {
      setError("Failed to send message.");
    }
  };

  // Filter users for search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2>Messages</h2>
      <Row>
        <Col md={4}>
          <h5>Conversations</h5>
          <ListGroup>
            {conversations.length === 0 ? (
              <ListGroup.Item>No conversations yet.</ListGroup.Item>
            ) : (
              conversations.map((conv) => (
                <ListGroup.Item
                  key={conv.user.id}
                  action
                  active={selectedUser === String(conv.user.id)}
                  onClick={() => setSelectedUser(String(conv.user.id))}
                >
                  {conv.user.username}
                  {conv.unread_count > 0 && (
                    <span className="badge bg-primary ms-2">
                      {conv.unread_count} unread
                    </span>
                  )}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
          <hr />
          <h6>Start New Message</h6>
          <InputGroup className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </InputGroup>
          <Form.Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={8}>
          {selectedUser ? (
            <>
              <div
                style={{ maxHeight: 400, overflowY: "auto", marginBottom: 16 }}
              >
                {loading ? (
                  <Spinner animation="border" />
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : conversation.length === 0 ? (
                  <Alert variant="info">No messages yet.</Alert>
                ) : (
                  conversation.map((msg) => (
                    <Card key={msg.id} className="mb-2">
                      <Card.Body>
                        <Card.Title>
                          From: {msg.sender?.username} | To:{" "}
                          {msg.receiver?.username}
                        </Card.Title>
                        <Card.Text>{msg.content}</Card.Text>
                        <small className="text-muted">
                          {new Date(msg.timestamp).toLocaleString()}
                        </small>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
              <Form onSubmit={handleSend} className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <Alert variant="info">
              Select a conversation or user to start messaging.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;
