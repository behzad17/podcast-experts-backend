import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaMicrophone,
  FaUsers,
  FaHandshake,
  FaRocket,
  FaEnvelope,
  FaGlobe,
  FaLightbulb,
  FaChartLine,
  FaComments,
  FaBookmark,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f8f9fa, #e3f2fd)",
        backgroundAttachment: "fixed",
        padding: "2rem 0",
      }}
    >
      <Container>
        {/* Header Section */}
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 text-primary mb-3">About CONNECT</h1>
            <p className="lead text-muted">
              Sweden's premier platform connecting podcasters with industry
              experts
            </p>
          </Col>
        </Row>

        {/* Project Description and Mission */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="h3 text-primary mb-3">
                  <FaLightbulb className="me-2" />
                  Our Mission
                </h2>
                <p className="text-muted mb-3">
                  CONNECT is dedicated to bridging the gap between podcast
                  creators and subject matter experts. We believe that great
                  content comes from collaboration between passionate creators
                  and knowledgeable specialists.
                </p>
                <p className="text-muted mb-0">
                  Our platform serves as a hub where podcasters can discover
                  experts in various fields, and experts can showcase their
                  knowledge to reach wider audiences through podcast
                  collaborations.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* How the Platform Works */}
        <Row className="mb-5">
          <Col>
            <h2 className="h3 text-primary mb-4 text-center">
              <FaRocket className="me-2" />
              How It Works
            </h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <FaMicrophone size={24} />
                    </div>
                    <h5>1. Discover</h5>
                    <p className="text-muted">
                      Browse through our curated list of podcasts and expert
                      profiles to find the perfect match for your needs.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <FaHandshake size={24} />
                    </div>
                    <h5>2. Connect</h5>
                    <p className="text-muted">
                      Reach out to experts or podcasters through our built-in
                      messaging system to discuss collaboration opportunities.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <FaUsers size={24} />
                    </div>
                    <h5>3. Collaborate</h5>
                    <p className="text-muted">
                      Work together to create amazing content that benefits both
                      the expert's reach and the podcaster's audience.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Platform Features Overview */}
        <Row className="mb-5">
          <Col>
            <h2 className="h3 text-primary mb-4 text-center">
              <FaStar className="me-2" />
              Platform Features
            </h2>
            <Row>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaMicrophone className="text-primary me-2" />
                  <span>Podcast Discovery & Management</span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaUsers className="text-primary me-2" />
                  <span>Expert Profile Creation</span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaComments className="text-primary me-2" />
                  <span>Direct Messaging System</span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaBookmark className="text-primary me-2" />
                  <span>Bookmark & Save Favorites</span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaChartLine className="text-primary me-2" />
                  <span>Featured Content Curation</span>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaGlobe className="text-primary me-2" />
                  <span>Category-based Organization</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* How to Get Started */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="h3 text-primary mb-3">
                  <FaRocket className="me-2" />
                  How to Get Started
                </h2>
                <Row>
                  <Col md={6}>
                    <h5 className="text-primary">For Podcasters:</h5>
                    <ol className="text-muted">
                      <li>Create an account and set up your profile</li>
                      <li>Browse expert categories and profiles</li>
                      <li>Connect with experts via messaging</li>
                      <li>Collaborate on content creation</li>
                    </ol>
                  </Col>
                  <Col md={6}>
                    <h5 className="text-primary">For Experts:</h5>
                    <ol className="text-muted">
                      <li>Sign up and create your expert profile</li>
                      <li>Showcase your expertise and experience</li>
                      <li>Get discovered by podcast creators</li>
                      <li>Grow your audience through collaborations</li>
                    </ol>
                  </Col>
                </Row>
                <div className="text-center mt-3">
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="lg"
                    className="me-2"
                  >
                    Get Started Today
                  </Button>
                  <Button
                    as={Link}
                    to="/experts"
                    variant="outline-primary"
                    size="lg"
                  >
                    Browse Experts
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Information */}
        <Row className="mb-5">
          <Col>
            <h2 className="h3 text-primary mb-4 text-center">
              <FaUsers className="me-2" />
              Our Team
            </h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <FaUsers size={32} className="text-muted" />
                    </div>
                    <h5>Development Team</h5>
                    <p className="text-muted">
                      Our skilled developers work tirelessly to create a
                      seamless and user-friendly platform experience.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <FaHandshake size={32} className="text-muted" />
                    </div>
                    <h5>Community Team</h5>
                    <p className="text-muted">
                      Dedicated to fostering connections and ensuring quality
                      interactions between our users.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100 text-center">
                  <Card.Body className="p-4">
                    <div
                      className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <FaGlobe size={32} className="text-muted" />
                    </div>
                    <h5>Support Team</h5>
                    <p className="text-muted">
                      Providing excellent customer support and helping users
                      make the most of our platform.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Contact Details */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="h3 text-primary mb-3">
                  <FaEnvelope className="me-2" />
                  Contact Us
                </h2>
                <Row>
                  <Col md={6}>
                    <h5 className="text-primary">Get in Touch</h5>
                    <p className="text-muted mb-2">
                      <FaEnvelope className="me-2" />
                      Email: info@connect-podcast-experts.com
                    </p>
                    <p className="text-muted mb-2">
                      <FaGlobe className="me-2" />
                      Website: www.connect-podcast-experts.com
                    </p>
                    <p className="text-muted mb-0">
                      <FaUsers className="me-2" />
                      Location: Stockholm, Sweden
                    </p>
                  </Col>
                  <Col md={6}>
                    <h5 className="text-primary">Support</h5>
                    <p className="text-muted mb-2">
                      Need help? Our support team is here to assist you with any
                      questions or issues.
                    </p>
                    <Button variant="outline-primary" size="sm">
                      Contact Support
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="mb-4">
          <Col className="text-center">
            <Card className="border-0 shadow-sm bg-primary text-white">
              <Card.Body className="p-4">
                <h3 className="mb-3">Ready to Start Connecting?</h3>
                <p className="mb-3">
                  Join thousands of podcasters and experts who are already using
                  CONNECT to create amazing content together.
                </p>
                <Button
                  as={Link}
                  to="/register"
                  variant="light"
                  size="lg"
                  className="me-2"
                >
                  Join Now
                </Button>
                <Button as={Link} to="/" variant="outline-light" size="lg">
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
