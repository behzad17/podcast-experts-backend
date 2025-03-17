import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <Nav className="mr-auto">
      {isAuthenticated && (
        <>
          <Nav.Link as={Link} to="/profile">
            Profile
          </Nav.Link>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </>
      )}
    </Nav>
  );
};

export default Navigation;
