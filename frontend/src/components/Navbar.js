import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";

function Navigation() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [hasExpertProfile, setHasExpertProfile] = useState(false);
  const [hasPodcasterProfile, setHasPodcasterProfile] = useState(false);
  const [expertProfileId, setExpertProfileId] = useState(null);
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);

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

  // Check if user has expert and podcaster profiles
  useEffect(() => {
    const checkProfiles = async () => {
      if (!user) {
        setHasExpertProfile(false);
        setHasPodcasterProfile(false);
        setProfileCheckLoading(false);
        return;
      }

      try {
        // Check expert profile
        try {
          const expertResponse = await api.get("/experts/my-profile/");
          setHasExpertProfile(true);
          // Store expert profile ID for linking to public profile view
          if (expertResponse.data?.id) {
            setExpertProfileId(expertResponse.data.id);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            setHasExpertProfile(false);
            setExpertProfileId(null);
          }
        }

        // Check podcaster profile
        try {
          await api.get("/podcasts/profiles/my_profile/");
          setHasPodcasterProfile(true);
        } catch (error) {
          if (error.response?.status === 404) {
            setHasPodcasterProfile(false);
          }
        }
      } catch (error) {
        console.error("Error checking profiles:", error);
      } finally {
        setProfileCheckLoading(false);
      }
    };

    checkProfiles();
  }, [user]);

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
                {/* My Account - always visible for logged-in users */}
                <NavDropdown.Item
                  as={Link}
                  to="/profile"
                  onClick={closeNavbar}
                >
                  My Account
                </NavDropdown.Item>

                {/* Expert Profile Section - only show if user already has expert profile */}
                {hasExpertProfile && (
                  <NavDropdown.Item
                    as={Link}
                    to={expertProfileId ? `/experts/${expertProfileId}` : "/experts"}
                    onClick={closeNavbar}
                  >
                    My Expert Profile
                  </NavDropdown.Item>
                )}

                {/* Podcaster Profile Section - only show if user already has podcaster profile */}
                {hasPodcasterProfile && (
                  <NavDropdown.Item
                    as={Link}
                    to="/podcaster/profile"
                    onClick={closeNavbar}
                  >
                    My Podcaster Profile
                  </NavDropdown.Item>
                )}

                {/* Create Podcast - only show if user has podcaster profile */}
                {hasPodcasterProfile && (
                  <NavDropdown.Item
                    as={Link}
                    to="/podcasts/create"
                    onClick={closeNavbar}
                  >
                    Create Podcast
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
