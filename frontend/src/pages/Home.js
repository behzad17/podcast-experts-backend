import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container className="mt-4">
      <Row className="text-center mb-4">
        <Col>
          <h1>Welcome to Podcast App</h1>
          <p>Discover amazing podcasts and share your own content</p>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <h3>Browse Podcasts</h3>
              <p>
                Explore our collection of podcasts. Find content that interests
                you and engage with creators.
              </p>
              <Link to="/podcasts" className="btn btn-primary">
                View Podcasts
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <h3>Create Content</h3>
              <p>
                Share your voice with the world. Create and manage your own
                podcasts.
              </p>
              <Link to="/podcasts/create" className="btn btn-primary">
                Start Creating
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
