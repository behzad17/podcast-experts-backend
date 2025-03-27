import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FaEnvelope, FaPlus } from "react-icons/fa";
import api from "../api/axios";

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Set up polling every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get("/messages/conversations/");
      const totalUnread = response.data.reduce(
        (sum, conv) => sum + conv.unread_count,
        0
      );
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Podcast Experts
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/podcasts">
              Podcasts
            </Nav.Link>
            <Nav.Link as={Link} to="/experts">
              Experts
            </Nav.Link>
            {user && (
              <>
                <Nav.Link
                  as={Link}
                  to="/messages"
                  className="position-relative"
                >
                  <FaEnvelope className="me-1" />
                  Messages
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle rounded-pill"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                {user.user_type === "podcaster" && (
                  <Nav.Link as={Link} to="/podcasts/create">
                    Create Podcast
                  </Nav.Link>
                )}
                {user.user_type === "expert" && (
                  <Nav.Link as={Link} to="/experts/create">
                    Create Expert Profile
                  </Nav.Link>
                )}
                {user.is_admin && (
                  <Nav.Link as={Link} to="/admin">
                    Admin Dashboard
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
