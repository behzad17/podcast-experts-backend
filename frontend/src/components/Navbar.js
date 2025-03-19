import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavigationBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login");
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
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/experts">
              Experts
            </Nav.Link>
            <Nav.Link as={Link} to="/podcasts">
              Podcasts
            </Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                {userType === "expert" && (
                  <Nav.Link as={Link} to="/experts/create">
                    Create Expert Profile
                  </Nav.Link>
                )}
                {userType === "podcaster" && (
                  <Nav.Link as={Link} to="/podcaster/create">
                    Create Podcaster Profile
                  </Nav.Link>
                )}
                <Button
                  variant="outline-light"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
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
};

export default NavigationBar;
