import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
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
                {user.user_type === "expert" && (
                  <Nav.Link as={Link} to="/profile">
                    Profile
                  </Nav.Link>
                )}
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
                <Nav.Link as={Link} to="/messages">
                  Messages
                </Nav.Link>
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
