import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>Podcast Experts</h5>
            <p>Connecting podcasters with industry experts</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>
              &copy; {new Date().getFullYear()} Podcast Experts. All rights
              reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
