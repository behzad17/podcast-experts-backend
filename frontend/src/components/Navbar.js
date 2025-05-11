import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          style={{ fontSize: "1.5rem", fontWeight: "600" }}
        >
          CONNECT
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
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
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navigation;
