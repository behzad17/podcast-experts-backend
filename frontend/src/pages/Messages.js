import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import MessageList from "../components/messages/MessageList";
import ChatWindow from "../components/messages/ChatWindow";
import api from "../api/axios";

const Messages = () => {
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userType, setUserType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/experts/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearching(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
      });

      if (userType) {
        params.append("user_type", userType);
      }

      if (userType === "expert" && selectedCategory) {
        params.append("category", selectedCategory);
      }

      const response = await api.get(`/users/search/search/?${params}`);
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleUserSelect = (user) => {
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchResults([]);
    setUserType("");
    setSelectedCategory("");
    window.location.href = `/messages/${user.id}`;
  };

  const getExpertCategories = async (expertId) => {
    try {
      const response = await api.get(`/experts/${expertId}/`);
      return response.data.categories || [];
    } catch (error) {
      console.error("Error fetching expert categories:", error);
      return [];
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header>
              <h4>Messages</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch} className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="">All User Types</option>
                    <option value="expert">Experts</option>
                    <option value="podcaster">Podcasters</option>
                    <option value="listener">Listeners</option>
                  </Form.Select>
                </Form.Group>
                {userType === "expert" && (
                  <Form.Group className="mb-3">
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <Button type="submit" variant="primary" disabled={searching}>
                  {searching ? "Searching..." : "Search"}
                </Button>
              </Form>

              {showSearchResults && (
                <Card className="mb-3">
                  <Card.Header>Search Results</Card.Header>
                  <ListGroup variant="flush">
                    {searchResults.map((user) => (
                      <ListGroup.Item
                        key={user.id}
                        action
                        onClick={() => handleUserSelect(user)}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6>{user.username}</h6>
                          <small className="text-muted">
                            {user.user_type.charAt(0).toUpperCase() +
                              user.user_type.slice(1)}
                          </small>
                          {user.user_type === "expert" && (
                            <div className="mt-1">
                              <small className="text-muted">
                                {user.expertise || "No expertise specified"}
                              </small>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserSelect(user);
                          }}
                        >
                          Message
                        </Button>
                      </ListGroup.Item>
                    ))}
                    {searchResults.length === 0 && (
                      <ListGroup.Item>No users found</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              )}

              <MessageList />
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          {userId ? (
            <ChatWindow userId={parseInt(userId)} />
          ) : (
            <div className="text-center mt-5">
              <h4>Select a conversation to start chatting</h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Messages;
