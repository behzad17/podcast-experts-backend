import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to Podcast Platform</h1>
        {isAuthenticated && (
          <div className="text-muted">
            You are logged in as{" "}
            {userType === "expert" ? "an Expert" : "a Podcaster"}
          </div>
        )}
      </div>
      <Row>
        <Col md={6}>
          <Card className="p-3">
            <h3>Find Experts</h3>
            <p>Search and connect with industry professionals.</p>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h3>Discover Podcasts</h3>
            <p>Explore and listen to amazing podcasts.</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
