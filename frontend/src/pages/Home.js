import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="mt-4">
      <h1>Welcome to Podcast Platform</h1>
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
