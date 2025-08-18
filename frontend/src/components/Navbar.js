import React, { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Function to close the navbar on mobile
  const closeNavbar = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          style={{ fontSize: "2rem", fontWeight: "600" }}
        >
          CONNECT
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/podcasts" onClick={closeNavbar}>
              Podcasts
            </Nav.Link>
            <Nav.Link as={Link} to="/experts" onClick={closeNavbar}>
              Experts
            </Nav.Link>
            {user && (
              <>
                {user.user_type === "expert" && (
                  <Nav.Link as={Link} to="/profile" onClick={closeNavbar}>
                    Profile
                  </Nav.Link>
                )}
                {user.user_type === "podcaster" && (
                  <Nav.Link
                    as={Link}
                    to="/podcasts/create"
                    onClick={closeNavbar}
                  >
                    Create Podcast
                  </Nav.Link>
                )}
                {user.user_type === "expert" && (
                  <Nav.Link
                    as={Link}
                    to="/experts/create"
                    onClick={closeNavbar}
                  >
                    Create Expert Profile
                  </Nav.Link>
                )}
                {user.is_admin && (
                  <Nav.Link as={Link} to="/admin" onClick={closeNavbar}>
                    Admin Dashboard
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/messages" onClick={closeNavbar}>
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
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={closeNavbar}>
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
