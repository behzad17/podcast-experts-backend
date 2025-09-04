import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaQuestionCircle,
  FaHeadset,
  FaComments,
  FaPaperPlane,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaUsers,
  FaRocket,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Make real API call to backend
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general",
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(
          result.error || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <FaEnvelope size={24} />,
      title: "Email Us",
      content: "info@connect-podcast-experts.com",
      link: "mailto:info@connect-podcast-experts.com",
      color: "#667eea",
      description: "Send us an email and we'll respond within 24 hours",
    },
    {
      icon: <FaPhone size={24} />,
      title: "Call Us",
      content: "+46 8 123 45 67",
      link: "tel:+4681234567",
      color: "#28a745",
      description: "Speak directly with our support team during business hours",
    },
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: "Visit Us",
      content: "Stockholm, Sweden",
      link: "#",
      color: "#ffc107",
      description: "Our headquarters in the heart of Stockholm",
    },
  ];

  const socialMedia = [
    {
      icon: <FaFacebook size={20} />,
      name: "Facebook",
      url: "https://facebook.com",
      color: "#1877f2",
    },
    {
      icon: <FaTwitter size={20} />,
      name: "Twitter",
      url: "https://twitter.com",
      color: "#1da1f2",
    },
    {
      icon: <FaLinkedin size={20} />,
      name: "LinkedIn",
      url: "https://linkedin.com",
      color: "#0077b5",
    },
    {
      icon: <FaInstagram size={20} />,
      name: "Instagram",
      url: "https://instagram.com",
      color: "#e4405f",
    },
  ];

  const faqData = [
    {
      question: "How do I get started as a podcaster?",
      answer:
        "Simply create an account, set up your podcaster profile, and start browsing expert profiles to find the perfect match for your content.",
    },
    {
      question: "How can I become an expert on the platform?",
      answer:
        "Register as an expert, create a detailed profile showcasing your expertise, and wait for podcasters to discover and contact you.",
    },
    {
      question: "Is there a fee to use the platform?",
      answer:
        "Basic features are free. Premium features and advanced matching algorithms are available with our subscription plans.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team through this contact form, email us directly, or use the live chat feature during business hours.",
    },
    {
      question: "What types of experts are available?",
      answer:
        "We have experts across all major categories including technology, health, business, entertainment, science, and many more specialized fields.",
    },
  ];

  const supportCategories = [
    {
      icon: <FaHeadset size={20} />,
      title: "Technical Support",
      description: "Help with platform features, bugs, or technical issues",
      responseTime: "Within 24 hours",
      color: "#667eea",
    },
    {
      icon: <FaComments size={20} />,
      title: "General Inquiries",
      description:
        "Questions about our services, partnerships, or general information",
      responseTime: "Within 48 hours",
      color: "#28a745",
    },
    {
      icon: <FaGlobe size={20} />,
      title: "Business Development",
      description:
        "Partnership opportunities, business inquiries, or collaboration requests",
      responseTime: "Within 72 hours",
      color: "#ffc107",
    },
  ];

  return (
    <div className="contact-page-modern">
      {/* Hero Section */}
      <div className="contact-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} md={12} className="text-center text-lg-start">
              <div className="hero-content">
                <div className="hero-badge">
                  <FaEnvelope />
                  <span>Get in Touch</span>
                </div>
                <h1 className="hero-title">
                  We're Here to <span className="gradient-text">Help You</span>
                </h1>
                <p className="hero-subtitle">
                  Have questions about CONNECT? Need support? Want to
                  collaborate? Our team is ready to assist you with anything you
                  need.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">24h</div>
                    <div className="stat-label">Response Time</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">99%</div>
                    <div className="stat-label">Satisfaction Rate</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Support Available</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={4} md={12} className="text-center">
              <div className="hero-visual">
                <div className="floating-card card-1">
                  <FaEnvelope />
                  <span>Email</span>
                </div>
                <div className="floating-card card-2">
                  <FaPhone />
                  <span>Call</span>
                </div>
                <div className="floating-card card-3">
                  <FaComments />
                  <span>Chat</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-5">
        {/* Contact Methods Section */}
        <Row className="mb-5">
          <Col>
            <div className="section-header text-center mb-5">
              <h2 className="section-title">
                <FaStar className="me-3" />
                Multiple Ways to Connect
              </h2>
              <p className="section-subtitle">
                Choose the method that works best for you
              </p>
            </div>
            <Row>
              {contactMethods.map((method, index) => (
                <Col lg={4} md={6} className="mb-4" key={index}>
                  <div className="contact-method-card">
                    <div
                      className="method-icon"
                      style={{ backgroundColor: method.color }}
                    >
                      {method.icon}
                    </div>
                    <h4 className="method-title">{method.title}</h4>
                    <p className="method-content">{method.content}</p>
                    <p className="method-description">{method.description}</p>
                    <Button
                      as="a"
                      href={method.link}
                      variant="outline-primary"
                      size="sm"
                      target={
                        method.link.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        method.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="method-btn"
                    >
                      {method.title}
                      <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <div className="contact-form-card">
              <div className="form-header">
                <h3 className="form-title">
                  <FaPaperPlane className="me-3" />
                  Send us a Message
                </h3>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you as soon as
                  possible
                </p>
              </div>

              {submitSuccess && (
                <Alert variant="success" className="success-alert">
                  <FaCheckCircle className="me-2" />
                  Thank you! Your message has been sent successfully. We'll get
                  back to you soon.
                </Alert>
              )}

              {submitError && (
                <Alert variant="danger" className="error-alert">
                  {submitError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="contact-form">
                <Row>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="form-input"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        className="form-input"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="form-group">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What is this about?"
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                    className="form-textarea"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="me-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </Form>
            </div>
          </Col>

          {/* Contact Information Sidebar */}
          <Col lg={4} className="mb-5">
            <div className="info-sidebar">
              {/* Business Hours */}
              <div className="info-card">
                <div className="info-header">
                  <FaClock className="info-icon" />
                  <h5>Business Hours</h5>
                </div>
                <div className="info-content">
                  <div className="time-item">
                    <strong>Monday - Friday:</strong>
                    <span>9:00 AM - 6:00 PM (CET)</span>
                  </div>
                  <div className="time-item">
                    <strong>Saturday:</strong>
                    <span>10:00 AM - 4:00 PM (CET)</span>
                  </div>
                  <div className="time-item">
                    <strong>Sunday:</strong>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="info-card">
                <div className="info-header">
                  <FaGlobe className="info-icon" />
                  <h5>Connect With Us</h5>
                </div>
                <div className="info-content">
                  <div className="social-buttons">
                    {socialMedia.map((social, index) => (
                      <Button
                        key={index}
                        as="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline-secondary"
                        size="sm"
                        className="social-btn"
                        style={{
                          borderColor: social.color,
                          color: social.color,
                        }}
                      >
                        {social.icon}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Response Times */}
              <div className="info-card">
                <div className="info-header">
                  <FaQuestionCircle className="info-icon" />
                  <h5>Response Times</h5>
                </div>
                <div className="info-content">
                  {supportCategories.map((category, index) => (
                    <div key={index} className="support-category">
                      <div className="category-header">
                        <span
                          className="category-icon"
                          style={{ color: category.color }}
                        >
                          {category.icon}
                        </span>
                        <strong>{category.title}</strong>
                      </div>
                      <small className="category-description">
                        {category.description}
                      </small>
                      <small className="response-time">
                        Response: {category.responseTime}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mb-5">
          <Col>
            <div className="faq-section">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">
                  <FaQuestionCircle className="me-3" />
                  Frequently Asked Questions
                </h2>
                <p className="section-subtitle">
                  Quick answers to common questions
                </p>
              </div>
              <div className="faq-grid">
                {faqData.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question">
                      <h5>{faq.question}</h5>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="mb-5">
          <Col>
            <div className="cta-card">
              <div className="cta-content">
                <h2 className="cta-title">Still Have Questions?</h2>
                <p className="cta-description">
                  Can't find what you're looking for? Our team is here to help
                  you get the most out of CONNECT.
                </p>
                <div className="cta-buttons">
                  <Button variant="light" size="lg" className="cta-btn primary">
                    <FaHeadset className="me-2" />
                    Live Chat
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="cta-btn secondary"
                  >
                    <FaEnvelope className="me-2" />
                    Email Support
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .contact-page-modern {
          min-height: 100vh;
          background: #EFF3FB;
        }
        .contact-hero {
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
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
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
        .contact-method-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          height: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .contact-method-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .method-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .method-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .method-content {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .method-description {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .method-btn {
          border-radius: 25px;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .method-btn:hover {
          transform: translateY(-2px);
        }
        .contact-form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        .form-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 0;
        }
        .success-alert {
          border-radius: 15px;
          border: none;
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          backdrop-filter: blur(10px);
          margin-bottom: 2rem;
        }
        .error-alert {
          border-radius: 15px;
          border: none;
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          backdrop-filter: blur(10px);
          margin-bottom: 2rem;
        }
        .contact-form .form-group {
          margin-bottom: 1.5rem;
        }
        .contact-form .form-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }
        .contact-form .form-input,
        .contact-form .form-select,
        .contact-form .form-textarea {
          border-radius: 15px;
          border: 2px solid #e9ecef;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }
        .contact-form .form-input:focus,
        .contact-form .form-select:focus,
        .contact-form .form-textarea:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .submit-btn {
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
          width: 100%;
          transition: all 0.3s ease;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
        }
        .info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .info-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .info-icon {
          color: #667eea;
          font-size: 1.2rem;
        }
        .info-header h5 {
          color: #333;
          margin: 0;
          font-weight: 700;
        }
        .info-content {
          color: #666;
        }
        .time-item {
          margin-bottom: 0.75rem;
        }
        .time-item strong {
          display: block;
          color: #333;
          margin-bottom: 0.25rem;
        }
        .time-item span {
          color: #666;
        }
        .social-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .social-btn {
          border-radius: 20px;
          padding: 0.5rem;
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          transform: translateY(-2px);
        }
        .support-category {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
        }
        .category-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .category-icon {
          font-size: 1rem;
        }
        .category-description {
          display: block;
          color: #666;
          margin-bottom: 0.25rem;
        }
        .response-time {
          display: block;
          color: #28a745;
          font-weight: 600;
        }
        .faq-section {
          margin-top: 4rem;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .faq-item {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .faq-question h5 {
          color: #333;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .faq-answer p {
          color: #666;
          line-height: 1.6;
          margin: 0;
        }
        .cta-card {
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
        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-btn {
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .cta-btn:hover {
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
          .form-title {
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
          .faq-grid {
            grid-template-columns: 1fr;
          }
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          .cta-btn {
            width: 100%;
            max-width: 300px;
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
          .contact-form-card {
            padding: 2rem;
          }
          .cta-card {
            padding: 2rem;
          }
          .cta-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.6rem;
          }

          .hero-subtitle {
            font-size: 0.85rem;
          }

          .hero-stats {
            gap: 0.5rem;
          }

          .stat-number {
            font-size: 1.3rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .floating-card {
            width: clamp(80px, 20vw, 90px);
            padding: 0.4rem;
          }

          .floating-card svg {
            font-size: clamp(1rem, 2.5vw, 1.2rem);
          }

          .floating-card span {
            font-size: clamp(0.6rem, 1.5vw, 0.7rem);
          }

          .contact-form-card {
            padding: 1.5rem;
          }

          .cta-card {
            padding: 1.5rem;
          }

          .cta-title {
            font-size: 1.8rem;
          }

          .method-icon {
            width: clamp(70px, 18vw, 80px);
            height: clamp(70px, 18vw, 80px);
            font-size: clamp(1.8rem, 4.5vw, 2rem);
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
