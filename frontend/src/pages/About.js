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
  FaArrowRight,
  FaShieldAlt,
  FaBulb,
  FaNetworkWired,
  FaBell,
  FaEnvelope as FaEnvelopeIcon,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-page-modern">
      {/* Hero Section */}
      <div className="about-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} md={12} className="text-center text-lg-start">
              <div className="hero-content">
                <div className="hero-badge">
                  <FaLightbulb />
                  <span>About CONNECT</span>
                </div>
                <h1 className="hero-title">
                  Sweden's Premier Platform for{" "}
                  <span className="gradient-text">Podcast Excellence</span>
                </h1>
                <p className="hero-subtitle">
                  Bridging the gap between passionate podcast creators and industry
                  experts to deliver exceptional content that educates, entertains,
                  and inspires audiences worldwide.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">1000+</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Expert Profiles</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Categories</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={4} md={12} className="text-center">
              <div className="hero-visual">
                <div className="floating-card card-1">
                  <FaMicrophone />
                  <span>Podcasters</span>
                </div>
                <div className="floating-card card-2">
                  <FaUsers />
                  <span>Experts</span>
                </div>
                <div className="floating-card card-3">
                  <FaHandshake />
                  <span>Connect</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-5">
        {/* Mission Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <div className="mission-card-modern">
              <div className="card-icon">
                <FaLightbulb />
              </div>
              <h2 className="card-title">Our Mission</h2>
              <p className="card-description">
                CONNECT is dedicated to bridging the gap between podcast creators
                and subject matter experts. We believe that great content comes
                from collaboration between passionate creators and knowledgeable
                specialists who share a common goal of delivering value to
                audiences.
              </p>
              <p className="card-description">
                Our platform serves as a hub where podcasters can discover
                experts in various fields, and experts can showcase their
                knowledge to reach wider audiences through meaningful podcast
                collaborations that benefit everyone involved.
              </p>
            </div>
          </Col>
        </Row>

        {/* How It Works Section */}
        <Row className="mb-5">
          <Col>
            <div className="section-header text-center mb-5">
              <h2 className="section-title">
                <FaRocket className="me-3" />
                How It Works
              </h2>
              <p className="section-subtitle">
                Three simple steps to start creating amazing content together
              </p>
            </div>
            <Row>
              <Col lg={4} md={6} className="mb-4">
                <div className="step-card-modern">
                  <div className="step-number">1</div>
                  <div className="step-icon">
                    <FaMicrophone />
                  </div>
                  <h3 className="step-title">Discover</h3>
                  <p className="step-description">
                    Browse through our curated list of podcasts and expert
                    profiles to find the perfect match for your content needs.
                  </p>
                  <div className="step-features">
                    <span className="feature-tag">Smart Matching</span>
                    <span className="feature-tag">Category Filters</span>
                    <span className="feature-tag">Advanced Search</span>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="step-card-modern">
                  <div className="step-number">2</div>
                  <div className="step-icon">
                    <FaHandshake />
                  </div>
                  <h3 className="step-title">Connect</h3>
                  <p className="step-description">
                    Reach out to experts or podcasters through our built-in
                    messaging system to discuss collaboration opportunities.
                  </p>
                  <div className="step-features">
                    <span className="feature-tag">Direct Messaging</span>
                    <span className="feature-tag">Video Calls</span>
                    <span className="feature-tag">File Sharing</span>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="step-card-modern">
                  <div className="step-number">3</div>
                  <div className="step-icon">
                    <FaUsers />
                  </div>
                  <h3 className="step-title">Collaborate</h3>
                  <p className="step-description">
                    Work together to create amazing content that benefits both
                    the expert's reach and the podcaster's audience.
                  </p>
                  <div className="step-features">
                    <span className="feature-tag">Content Planning</span>
                    <span className="feature-tag">Recording Tools</span>
                    <span className="feature-tag">Analytics</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Platform Features Section */}
        <Row className="mb-5">
          <Col>
            <div className="section-header text-center mb-5">
              <h2 className="section-title">
                <FaStar className="me-3" />
                Platform Features
              </h2>
              <p className="section-subtitle">
                Everything you need to create, connect, and collaborate
              </p>
            </div>
            <Row>
              <Col lg={3} md={6} className="mb-4">
                <div className="feature-card-modern">
                  <div className="feature-icon">
                    <FaMicrophone />
                  </div>
                  <h4 className="feature-title">Podcast Discovery</h4>
                  <p className="feature-description">
                    Find and explore amazing podcasts across all categories
                  </p>
                  <span className="feature-tag">Smart Lists</span>
                </div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <div className="feature-card-modern">
                  <div className="feature-icon">
                    <FaUsers />
                  </div>
                  <h4 className="feature-title">Expert Profiles</h4>
                  <p className="feature-description">
                    Create detailed profiles showcasing your expertise
                  </p>
                  <span className="feature-tag">Verification</span>
                </div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <div className="feature-card-modern">
                  <div className="feature-icon">
                    <FaComments />
                  </div>
                  <h4 className="feature-title">Direct Messaging</h4>
                  <p className="feature-description">
                    Built-in communication system for seamless collaboration
                  </p>
                  <span className="feature-tag">File Sharing</span>
                </div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <div className="feature-card-modern">
                  <div className="feature-icon">
                    <FaBookmark />
                  </div>
                  <h4 className="feature-title">Bookmark System</h4>
                  <p className="feature-description">
                    Save and organize your favorite content and connections
                  </p>
                  <span className="feature-tag">Smart Lists</span>
                </div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <div className="feature-card-modern">
                  <div className="feature-icon">
                    <FaChartLine />
                  </div>
                  <h4 className="feature-title">Content Curation</h4>
                  <p className="feature-description">
                    Featured content and trending topics discovery
                  </p>
                  <span className="feature-tag">Trending Topics</span>
                </div>
              </Col>
              <Col lg={3} md={6} className="mb-4">
                <div className="feature-card-modern">
                  <div className="feature-icon">
                    <FaGlobe />
                  </div>
                  <h4 className="feature-title">Global Network</h4>
                  <p className="feature-description">
                    Connect with experts and creators worldwide
                  </p>
                  <span className="feature-tag">Cultural Diversity</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* How to Get Started Section */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <div className="get-started-card-modern">
              <div className="card-header-section">
                <h2 className="card-title">
                  <FaRocket className="me-3" />
                  How to Get Started
                </h2>
                <p className="card-subtitle">
                  Join our community in just a few simple steps
                </p>
              </div>
              <Row>
                <Col lg={6} className="mb-4">
                  <div className="user-type-card">
                    <div className="user-type-header">
                      <div className="user-type-icon">
                        <FaMicrophone />
                      </div>
                      <h4>For Podcasters</h4>
                    </div>
                    <ol className="user-type-steps">
                      <li>Create an account and set up your profile</li>
                      <li>Browse expert categories and profiles</li>
                      <li>Connect with experts via messaging</li>
                      <li>Collaborate on content creation</li>
                    </ol>
                  </div>
                </Col>
                <Col lg={6} className="mb-4">
                  <div className="user-type-card">
                    <div className="user-type-header">
                      <div className="user-type-icon">
                        <FaUsers />
                      </div>
                      <h4>For Experts</h4>
                    </div>
                    <ol className="user-type-steps">
                      <li>Sign up and create your expert profile</li>
                      <li>Showcase your expertise and experience</li>
                      <li>Get discovered by podcast creators</li>
                      <li>Grow your audience through collaborations</li>
                    </ol>
                  </div>
                </Col>
              </Row>
              <div className="cta-buttons">
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="lg"
                  className="cta-btn primary"
                >
                  Get Started Today
                  <FaArrowRight className="ms-2" />
                </Button>
                <Button
                  as={Link}
                  to="/experts"
                  variant="outline-primary"
                  size="lg"
                  className="cta-btn secondary"
                >
                  Browse Experts
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-5">
          <Col>
            <div className="section-header text-center mb-5">
              <h2 className="section-title">
                <FaUsers className="me-3" />
                Our Team
              </h2>
              <p className="section-subtitle">
                Meet the dedicated professionals behind CONNECT
              </p>
            </div>
            <Row>
              <Col lg={4} md={6} className="mb-4">
                <div className="team-card-modern">
                  <div className="team-avatar">
                    <FaUsers />
                  </div>
                  <h4 className="team-name">Development Team</h4>
                  <p className="team-description">
                    Our skilled developers work tirelessly to create a seamless
                    and user-friendly platform experience.
                  </p>
                  <div className="team-skills">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Django</span>
                    <span className="skill-tag">Cloudinary</span>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="team-card-modern">
                  <div className="team-avatar">
                    <FaHandshake />
                  </div>
                  <h4 className="team-name">Community Team</h4>
                  <p className="team-description">
                    Dedicated to fostering connections and ensuring quality
                    interactions between our users.
                  </p>
                  <div className="team-skills">
                    <span className="skill-tag">Community</span>
                    <span className="skill-tag">Support</span>
                    <span className="skill-tag">Growth</span>
                  </div>
                </div>
              </Col>
              <Col lg={4} md={6} className="mb-4">
                <div className="team-card-modern">
                  <div className="team-avatar">
                    <FaGlobe />
                  </div>
                  <h4 className="team-name">Support Team</h4>
                  <p className="team-description">
                    Providing excellent customer support and helping users make
                    the most of our platform.
                  </p>
                  <div className="team-skills">
                    <span className="skill-tag">24/7 Support</span>
                    <span className="skill-tag">Documentation</span>
                    <span className="skill-tag">Training</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <div className="contact-card-modern">
              <div className="card-header-section">
                <h2 className="card-title">
                  <FaEnvelope className="me-3" />
                  Contact Us
                </h2>
                <p className="card-subtitle">
                  Get in touch with our team for support and inquiries
                </p>
              </div>
              <Row>
                <Col lg={6} className="mb-4">
                  <div className="contact-info">
                    <h5>Get in Touch</h5>
                    <div className="contact-item">
                      <FaEnvelopeIcon className="contact-icon" />
                      <span>info@connect-podcast-experts.com</span>
                    </div>
                    <div className="contact-item">
                      <FaGlobe className="contact-icon" />
                      <span>www.connect-podcast-experts.com</span>
                    </div>
                    <div className="contact-item">
                      <FaUsers className="contact-icon" />
                      <span>Stockholm, Sweden</span>
                    </div>
                  </div>
                </Col>
                <Col lg={6} className="mb-4">
                  <div className="support-info">
                    <h5>Support</h5>
                    <p>
                      Need help? Our support team is here to assist you with any
                      questions or issues you may have.
                    </p>
                    <Button variant="outline-primary" size="sm" className="support-btn">
                      Contact Support
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Final CTA Section */}
        <Row className="mb-5">
          <Col>
            <div className="final-cta-card-modern">
              <div className="cta-content">
                <h2 className="cta-title">Ready to Start Connecting?</h2>
                <p className="cta-description">
                  Join thousands of podcasters and experts who are already using
                  CONNECT to create amazing content together.
                </p>
                <div className="cta-buttons">
                  <Button
                    as={Link}
                    to="/register"
                    variant="light"
                    size="lg"
                    className="cta-btn primary"
                  >
                    Join Now
                    <FaArrowRight className="ms-2" />
                  </Button>
                  <Button
                    as={Link}
                    to="/"
                    variant="outline-light"
                    size="lg"
                    className="cta-btn secondary"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .about-page-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .about-hero {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem 0;
          color: white;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: #ffd700;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .gradient-text {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          line-height: 1.5;
        }
        .hero-stats {
          display: flex;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #ffd700;
          margin-bottom: 0.4rem;
        }
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .hero-visual {
          position: relative;
          height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .floating-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1rem;
          text-align: center;
          color: white;
          animation: float 6s ease-in-out infinite;
          width: 120px;
          transition: all 0.3s ease;
        }
        .floating-card:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.15);
        }
        .floating-card.card-1 {
          animation-delay: 0s;
        }
        .floating-card.card-2 {
          animation-delay: 2s;
        }
        .floating-card.card-3 {
          animation-delay: 4s;
        }
        .floating-card svg {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #ffd700;
        }
        .floating-card span {
          font-size: 0.9rem;
          font-weight: 600;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .section-header {
          margin-bottom: 3rem;
        }
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }
        .section-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }
        .mission-card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .card-icon {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .card-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1.5rem;
        }
        .card-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .step-card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          height: 100%;
          position: relative;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .step-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        .step-number {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-weight: 700;
          font-size: 1.2rem;
        }
        .step-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .step-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .step-description {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .step-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        .feature-tag {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .feature-card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          height: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .feature-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .feature-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-size: 1.8rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
        }
        .feature-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .feature-description {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .get-started-card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .card-header-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        .card-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 0;
        }
        .user-type-card {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }
        .user-type-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .user-type-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        .user-type-header h4 {
          color: #333;
          margin: 0;
          font-weight: 700;
        }
        .user-type-steps {
          color: #666;
          line-height: 1.6;
        }
        .user-type-steps li {
          margin-bottom: 0.5rem;
        }
        .cta-buttons {
          text-align: center;
          margin-top: 2rem;
        }
        .cta-btn {
          margin: 0 0.5rem;
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
        }
        .team-card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          height: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .team-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .team-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .team-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .team-description {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .team-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        .skill-tag {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #333;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .contact-card-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .contact-info h5,
        .support-info h5 {
          color: #333;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #666;
        }
        .contact-icon {
          color: #667eea;
          width: 16px;
        }
        .support-info p {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .support-btn {
          border-radius: 20px;
          padding: 0.5rem 1.5rem;
        }
        .final-cta-card-modern {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 25px;
          padding: 3rem;
          text-align: center;
          color: white;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .cta-description {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-buttons .cta-btn {
          margin: 0 0.5rem;
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cta-buttons .cta-btn:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }
          .section-title {
            font-size: 2rem;
          }
          .card-title {
            font-size: 1.5rem;
          }
          .hero-visual {
            height: auto;
            margin-top: 1.5rem;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .floating-card {
            width: 100px;
            padding: 0.75rem;
          }
          .floating-card svg {
            font-size: 1.5rem;
          }
          .floating-card span {
            font-size: 0.8rem;
          }
        }
        @media (max-width: 576px) {
          .hero-title {
            font-size: 1.8rem;
          }
          .hero-subtitle {
            font-size: 0.9rem;
          }
          .hero-stats {
            gap: 0.75rem;
          }
          .stat-number {
            font-size: 1.5rem;
          }
          .stat-label {
            font-size: 0.8rem;
          }
          .floating-card {
            width: 90px;
            padding: 0.5rem;
          }
          .floating-card svg {
            font-size: 1.2rem;
          }
          .floating-card span {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
