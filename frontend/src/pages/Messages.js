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
import { useParams, useNavigate } from "react-router-dom";
import MessageList from "../components/messages/MessageList";
import ChatWindow from "../components/messages/ChatWindow";
import api from "../api/axios";
import {
  FaSearch,
  FaEnvelope,
  FaComments,
  FaUserFriends,
  FaFilter,
  FaPlus,
  FaBell,
  FaStar,
  FaArrowRight,
  FaUsers,
  FaMicrophone,
  FaUserTie,
} from "react-icons/fa";

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
    navigate(`/messages/${user.id}`);
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
    <div className="messages-page-modern">
      {/* Hero Section */}
      <div className="messages-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} md={12} className="text-center text-lg-start">
              <div className="hero-content">
                <div className="hero-badge">
                  <FaEnvelope />
                  <span>Connect & Chat</span>
                </div>
                <h1 className="hero-title">
                  Stay Connected with{" "}
                  <span className="gradient-text">Your Network</span>
                </h1>
                <p className="hero-subtitle">
                  Message experts, podcasters, and listeners. Build meaningful
                  connections and collaborate on amazing content together.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">
                      <FaComments />
                    </div>
                    <div className="stat-label">Active Chats</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      <FaUserFriends />
                    </div>
                    <div className="stat-label">Connections</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      <FaEnvelope />
                    </div>
                    <div className="stat-label">Messages</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={4} md={12} className="text-center">
              <div className="hero-visual">
                <div className="floating-card card-1">
                  <FaEnvelope />
                  <span>Chat</span>
                </div>
                <div className="floating-card card-2">
                  <FaComments />
                  <span>Connect</span>
                </div>
                <div className="floating-card card-3">
                  <FaUserFriends />
                  <span>Network</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-5">
        <Row>
          {/* Left Sidebar - Search & Conversations */}
          <Col lg={4} md={12} className="mb-4">
            <div className="messages-sidebar">
              {/* Search Section */}
              <div className="search-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <FaSearch className="me-2" />
                    Find People to Chat With
                  </h3>
                  <p className="section-subtitle">
                    Search for experts, podcasters, or listeners
                  </p>
                </div>

                <Form onSubmit={handleSearch} className="search-form">
                  <Form.Group className="form-group">
                    <Form.Control
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="form-select"
                    >
                      <option value="">All User Types</option>
                      <option value="expert">Experts</option>
                      <option value="podcaster">Podcasters</option>
                      <option value="listener">Listeners</option>
                    </Form.Select>
                  </Form.Group>

                  {userType === "expert" && (
                    <Form.Group className="form-group">
                      <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="form-select"
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

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={searching}
                    className="search-btn"
                  >
                    {searching ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <FaSearch className="me-2" />
                        Search
                      </>
                    )}
                  </Button>
                </Form>

                {/* Search Results */}
                {showSearchResults && (
                  <div className="search-results">
                    <div className="results-header">
                      <h5>Search Results</h5>
                      <Badge bg="primary" className="results-count">
                        {searchResults.length} found
                      </Badge>
                    </div>

                    <div className="results-list">
                      {searchResults.map((user) => (
                        <div key={user.id} className="user-result-card">
                          <div className="user-avatar">
                            {user.user_type === "expert" ? (
                              <FaUserTie className="avatar-icon expert" />
                            ) : user.user_type === "podcaster" ? (
                              <FaMicrophone className="avatar-icon podcaster" />
                            ) : (
                              <FaUsers className="avatar-icon listener" />
                            )}
                          </div>

                          <div className="user-info">
                            <h6 className="user-name">{user.username}</h6>
                            <div className="user-type">
                              <Badge
                                bg={
                                  user.user_type === "expert"
                                    ? "warning"
                                    : user.user_type === "podcaster"
                                    ? "info"
                                    : "secondary"
                                }
                                className="type-badge"
                              >
                                {user.user_type.charAt(0).toUpperCase() +
                                  user.user_type.slice(1)}
                              </Badge>
                            </div>
                            {user.user_type === "expert" && (
                              <div className="user-expertise">
                                <small className="text-muted">
                                  {user.expertise || "No expertise specified"}
                                </small>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="message-btn"
                            onClick={() => handleUserSelect(user)}
                          >
                            <FaEnvelope className="me-1" />
                            Message
                          </Button>
                        </div>
                      ))}

                      {searchResults.length === 0 && (
                        <div className="no-results">
                          <FaSearch className="no-results-icon" />
                          <p>No users found</p>
                          <small>Try adjusting your search criteria</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Conversations Section */}
              <div className="conversations-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <FaComments className="me-2" />
                    Recent Conversations
                  </h3>
                  <p className="section-subtitle">
                    Continue your ongoing chats
                  </p>
                </div>

                <MessageList />
              </div>
            </div>
          </Col>

          {/* Right Side - Chat Window */}
          <Col lg={8} md={12}>
            {userId ? (
              <ChatWindow userId={parseInt(userId)} />
            ) : (
              <div className="welcome-chat">
                <div className="welcome-content">
                  <div className="welcome-icon">
                    <FaEnvelope />
                  </div>
                  <h3 className="welcome-title">Welcome to Messages</h3>
                  <p className="welcome-subtitle">
                    Select a conversation from the left sidebar to start
                    chatting, or search for new people to connect with.
                  </p>
                  <div className="welcome-features">
                    <div className="feature-item">
                      <FaSearch className="feature-icon" />
                      <span>Search for users</span>
                    </div>
                    <div className="feature-item">
                      <FaComments className="feature-icon" />
                      <span>Start conversations</span>
                    </div>
                    <div className="feature-item">
                      <FaUserFriends className="feature-icon" />
                      <span>Build connections</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .messages-page-modern {
          min-height: 100vh;
          background: #819dde;
        }
        .messages-hero {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
          color: white;
          border-radius: 10px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #ffd700;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .gradient-text {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          line-height: 1.5;
        }
        .hero-stats {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          font-size: 2rem;
          color: #ffd700;
          margin-bottom: 0.4rem;
        }
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .hero-visual {
          position: relative;
          height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .floating-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1rem;
          text-align: center;
          color: white;
          animation: float 6s ease-in-out infinite;
          width: 120px;
          transition: all 0.3s ease;
        }
        .floating-card:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.15);
        }
        .floating-card.card-1 {
          animation-delay: 0s;
        }
        .floating-card.card-2 {
          animation-delay: 2s;
        }
        .floating-card.card-3 {
          animation-delay: 4s;
        }
        .floating-card svg {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #ffd700;
        }
        .floating-card span {
          font-size: 0.9rem;
          font-weight: 600;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .messages-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .search-section,
        .conversations-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .section-header {
          margin-bottom: 1.5rem;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .section-subtitle {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }
        .search-form {
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .search-input,
        .form-select {
          border-radius: 15px;
          border: 2px solid #e9ecef;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }
        .search-input:focus,
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .search-btn {
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          width: 100%;
          transition: all 0.3s ease;
        }
        .search-btn:hover {
          transform: translateY(-2px);
        }
        .search-results {
          margin-top: 1.5rem;
        }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .results-header h5 {
          margin: 0;
          color: #333;
          font-weight: 600;
        }
        .results-count {
          font-size: 0.8rem;
        }
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .user-result-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
          border: 1px solid rgba(102, 126, 234, 0.1);
          transition: all 0.3s ease;
        }
        .user-result-card:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }
        .avatar-icon.expert {
          color: #ffd700;
        }
        .avatar-icon.podcaster {
          color: #28a745;
        }
        .avatar-icon.listener {
          color: #17a2b8;
        }
        .user-info {
          flex: 1;
        }
        .user-name {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-weight: 600;
        }
        .user-type {
          margin-bottom: 0.25rem;
        }
        .type-badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }
        .user-expertise {
          font-size: 0.8rem;
        }
        .message-btn {
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }
        .message-btn:hover {
          transform: translateY(-2px);
        }
        .no-results {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        .no-results-icon {
          font-size: 3rem;
          color: #ddd;
          margin-bottom: 1rem;
        }
        .welcome-chat {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .welcome-content {
          max-width: 500px;
        }
        .welcome-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          margin: 0 auto 2rem;
        }
        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .welcome-subtitle {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .welcome-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
          color: #333;
        }
        .feature-icon {
          color: #667eea;
          font-size: 1.2rem;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }
          .hero-visual {
            height: auto;
            margin-top: 1.5rem;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .floating-card {
            width: 100px;
            padding: 0.75rem;
          }
          .floating-card svg {
            font-size: 1.5rem;
          }
          .floating-card span {
            font-size: 0.8rem;
          }
          .welcome-chat {
            padding: 2rem;
          }
          .welcome-title {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .hero-title {
            font-size: 1.8rem;
          }
          .hero-subtitle {
            font-size: 0.9rem;
          }
          .hero-stats {
            gap: 0.75rem;
          }
          .stat-number {
            font-size: 1.5rem;
          }
          .stat-label {
            font-size: 0.8rem;
          }
          .floating-card {
            width: 90px;
            padding: 0.5rem;
          }
          .floating-card svg {
            font-size: 1.2rem;
          }
          .floating-card span {
            font-size: 0.7rem;
          }
          .search-section,
          .conversations-section {
            padding: 1.5rem;
          }
          .welcome-chat {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.6rem;
          }

          .hero-subtitle {
            font-size: 0.85rem;
          }

          .hero-stats {
            gap: 0.5rem;
          }

          .stat-number {
            font-size: 1.3rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .floating-card {
            width: clamp(80px, 20vw, 90px);
            padding: 0.4rem;
          }

          .floating-card svg {
            font-size: clamp(1rem, 2.5vw, 1.2rem);
          }

          .floating-card span {
            font-size: clamp(0.6rem, 1.5vw, 0.7rem);
          }

          .welcome-icon {
            width: clamp(80px, 20vw, 100px);
            height: clamp(80px, 20vw, 100px);
            font-size: clamp(2.5rem, 6vw, 3rem);
          }

          .user-avatar {
            width: clamp(45px, 11vw, 50px);
            height: clamp(45px, 11vw, 50px);
            font-size: clamp(1.3rem, 3vw, 1.5rem);
          }

          .conversation-avatar {
            width: clamp(45px, 11vw, 50px);
            height: clamp(45px, 11vw, 50px);
          }

          .message-avatar {
            width: clamp(30px, 7vw, 35px);
            height: clamp(30px, 7vw, 35px);
          }
        }

        /* Enhanced MessageList Styles */
        .conversations-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .conversation-item {
          border-radius: 15px;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .conversation-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .conversation-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }
        .conversation-link:hover {
          background: rgba(102, 126, 234, 0.1);
          text-decoration: none;
          color: inherit;
        }
        .conversation-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .conversation-content {
          flex: 1;
          min-width: 0;
        }
        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .conversation-name {
          margin: 0;
          color: #333;
          font-weight: 600;
          font-size: 1rem;
        }
        .conversation-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .type-badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }
        .unread-badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }
        .conversation-preview {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .last-message {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
        }
        .message-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #999;
          font-size: 0.8rem;
        }
        .time-icon {
          font-size: 0.7rem;
        }
        .conversations-loading {
          text-align: center;
          padding: 2rem;
        }
        .loading-spinner {
          margin-bottom: 1rem;
        }
        .spinner-ring {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loading-text {
          color: #666;
          margin: 0;
        }
        .no-conversations {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        .no-conversations-icon {
          font-size: 3rem;
          color: #ddd;
          margin-bottom: 1rem;
        }
        .no-conversations-title {
          color: #333;
          margin-bottom: 0.5rem;
        }
        .no-conversations-subtitle {
          color: #999;
          margin: 0;
          font-size: 0.9rem;
        }

        /* Enhanced ChatWindow Styles */
        .chat-window-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }
        .chat-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }
        .user-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .user-name {
          margin: 0;
          color: #333;
          font-weight: 600;
        }
        .user-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .status-indicator {
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }
        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-btn {
          border-radius: 20px;
          padding: 0.5rem;
          transition: all 0.3s ease;
        }
        .action-btn:hover {
          transform: translateY(-2px);
        }
        .messages-area {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          background: rgba(248, 249, 250, 0.5);
        }
        .no-messages {
          text-align: center;
          padding: 3rem 1rem;
          color: #666;
        }
        .no-messages-icon {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 1rem;
        }
        .no-messages h6 {
          color: #333;
          margin-bottom: 0.5rem;
        }
        .no-messages p {
          color: #999;
          margin: 0;
        }
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }
        .message-item.sent {
          flex-direction: row-reverse;
        }
        .message-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .message-content {
          max-width: 70%;
        }
        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 18px;
          position: relative;
        }
        .message-item.sent .message-bubble {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .message-item.received .message-bubble {
          background: white;
          color: #333;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-bottom-left-radius: 4px;
        }
        .message-text {
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }
        .message-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.8;
        }
        .time-icon {
          font-size: 0.7rem;
        }
        .message-input-area {
          padding: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.9);
        }
        .message-form {
          margin: 0;
        }
        .input-group {
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .message-input {
          border: none;
          padding: 0.75rem 1rem;
          font-size: 1rem;
        }
        .message-input:focus {
          box-shadow: none;
          border-color: transparent;
        }
        .send-btn {
          border-radius: 0 25px 25px 0;
          padding: 0.75rem 1.25rem;
          border: none;
          transition: all 0.3s ease;
        }
        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .send-btn:disabled {
          opacity: 0.6;
        }

        /* Prevent flickering and ensure smooth transitions */
        .message-input-area {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .message-input {
          transition: all 0.2s ease;
          will-change: transform;
          transform: translateZ(0);
        }

        .message-input:focus {
          transform: translateZ(0);
          outline: none;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .send-btn {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .send-btn:not(:disabled):hover {
          transform: translateY(-2px) translateZ(0);
        }

        /* Smooth loading states */
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
          border-width: 0.15em;
        }

        /* Prevent layout shift during message sending */
        .messages-area {
          will-change: scroll-position;
        }

        .message-item {
          will-change: transform;
          transform: translateZ(0);
        }
        .chat-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
        }
        .welcome-chat {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .welcome-content {
          max-width: 500px;
        }
        .welcome-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          margin: 0 auto 2rem;
        }
        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .welcome-subtitle {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Messages;
