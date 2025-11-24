import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa";
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
            {/* Public links - visible to everyone */}
            <Nav.Link as={Link} to="/podcasts" onClick={closeNavbar}>
              Podcasts
            </Nav.Link>
            <Nav.Link as={Link} to="/experts" onClick={closeNavbar}>
              Experts
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={closeNavbar}>
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              // User dropdown menu when logged in
              <NavDropdown
                title={
                  <span>
                    <FaUser className="me-1" />
                    Hi, {user.username}
                  </span>
                }
                id="user-nav-dropdown"
                align="end"
              >
                {/* Profile link - different routes based on user type */}
                {user.user_type === "expert" && (
                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    onClick={closeNavbar}
                  >
                    Profile
                  </NavDropdown.Item>
                )}
                {user.user_type === "podcaster" && (
                  <NavDropdown.Item
                    as={Link}
                    to="/podcaster/profile"
                    onClick={closeNavbar}
                  >
                    Profile
                  </NavDropdown.Item>
                )}

                {/* My Podcasts / Dashboard */}
                {user.user_type === "podcaster" && (
                  <NavDropdown.Item
                    as={Link}
                    to="/podcasts"
                    onClick={closeNavbar}
                  >
                    My Podcasts
                  </NavDropdown.Item>
                )}
                {user.user_type === "expert" && (
                  <NavDropdown.Item
                    as={Link}
                    to="/experts"
                    onClick={closeNavbar}
                  >
                    My Profile
                  </NavDropdown.Item>
                )}

                {/* Create links based on user type */}
                {user.user_type === "podcaster" && (
                  <NavDropdown.Item
                    as={Link}
                    to="/podcasts/create"
                    onClick={closeNavbar}
                  >
                    Create Podcast
                  </NavDropdown.Item>
                )}
                {user.user_type === "expert" && (
                  <NavDropdown.Item
                    as={Link}
                    to="/experts/create"
                    onClick={closeNavbar}
                  >
                    Create Expert Profile
                  </NavDropdown.Item>
                )}

                {/* Messages */}
                <NavDropdown.Item
                  as={Link}
                  to="/messages"
                  onClick={closeNavbar}
                >
                  Messages
                </NavDropdown.Item>

                {/* Admin Dashboard */}
                {user.is_admin && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      as={Link}
                      to="/admin"
                      onClick={closeNavbar}
                    >
                      Admin Dashboard
                    </NavDropdown.Item>
                  </>
                )}

                {/* Logout */}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Login/Register links when logged out
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
