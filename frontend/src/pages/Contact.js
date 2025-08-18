import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Accordion } from "react-bootstrap";
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
  FaCheckCircle
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general"
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <FaEnvelope size={24} />,
      title: "Email Us",
      content: "info@connect-podcast-experts.com",
      link: "mailto:info@connect-podcast-experts.com",
      color: "primary"
    },
    {
      icon: <FaPhone size={24} />,
      title: "Call Us",
      content: "+46 8 123 45 67",
      link: "tel:+4681234567",
      color: "success"
    },
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: "Visit Us",
      content: "Stockholm, Sweden",
      link: "#",
      color: "warning"
    }
  ];

  const socialMedia = [
    { icon: <FaFacebook size={20} />, name: "Facebook", url: "https://facebook.com", color: "#1877f2" },
    { icon: <FaTwitter size={20} />, name: "Twitter", url: "https://twitter.com", color: "#1da1f2" },
    { icon: <FaLinkedin size={20} />, name: "LinkedIn", url: "https://linkedin.com", color: "#0077b5" },
    { icon: <FaInstagram size={20} />, name: "Instagram", url: "https://instagram.com", color: "#e4405f" }
  ];

  const faqData = [
    {
      question: "How do I get started as a podcaster?",
      answer: "Simply create an account, set up your podcaster profile, and start browsing expert profiles to find the perfect match for your content."
    },
    {
      question: "How can I become an expert on the platform?",
      answer: "Register as an expert, create a detailed profile showcasing your expertise, and wait for podcasters to discover and contact you."
    },
    {
      question: "Is there a fee to use the platform?",
      answer: "Basic features are free. Premium features and advanced matching algorithms are available with our subscription plans."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through this contact form, email us directly, or use the live chat feature during business hours."
    },
    {
      question: "What types of experts are available?",
      answer: "We have experts across all major categories including technology, health, business, entertainment, science, and many more specialized fields."
    }
  ];

  const supportCategories = [
    {
      icon: <FaHeadset size={20} />,
      title: "Technical Support",
      description: "Help with platform features, bugs, or technical issues",
      responseTime: "Within 24 hours"
    },
    {
      icon: <FaComments size={20} />,
      title: "General Inquiries",
      description: "Questions about our services, partnerships, or general information",
      responseTime: "Within 48 hours"
    },
    {
      icon: <FaGlobe size={20} />,
      title: "Business Development",
      description: "Partnership opportunities, business inquiries, or collaboration requests",
      responseTime: "Within 72 hours"
    }
  ];

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
            <h1 className="display-4 text-primary mb-3">
              Contact Us
            </h1>
            <p className="lead text-muted">
              Get in touch with our team. We're here to help and answer any questions you may have.
            </p>
          </Col>
        </Row>

        {/* Contact Methods Cards */}
        <Row className="mb-5">
          {contactMethods.map((method, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="p-4">
                  <div className={`bg-${method.color} text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                       style={{ width: "60px", height: "60px" }}>
                    {method.icon}
                  </div>
                  <h5>{method.title}</h5>
                  <p className="text-muted mb-2">{method.content}</p>
                  <Button 
                    as="a" 
                    href={method.link} 
                    variant={`outline-${method.color}`} 
                    size="sm"
                    target={method.link.startsWith('http') ? "_blank" : undefined}
                    rel={method.link.startsWith('http') ? "noopener noreferrer" : undefined}
                  >
                    {method.title}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">
                  <FaPaperPlane className="me-2" />
                  Send us a Message
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                {submitSuccess && (
                  <Alert variant="success" className="d-flex align-items-center">
                    <FaCheckCircle className="me-2" />
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </Alert>
                )}

                {submitError && (
                  <Alert variant="danger">
                    {submitError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What is this about?"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="w-100"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information Sidebar */}
          <Col lg={4} className="mb-5">
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaClock className="me-2" />
                  Business Hours
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-2">
                  <strong>Monday - Friday:</strong><br />
                  9:00 AM - 6:00 PM (CET)
                </div>
                <div className="mb-2">
                  <strong>Saturday:</strong><br />
                  10:00 AM - 4:00 PM (CET)
                </div>
                <div>
                  <strong>Sunday:</strong><br />
                  Closed
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaGlobe className="me-2" />
                  Connect With Us
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-2">
                  {socialMedia.map((social, index) => (
                    <Button
                      key={index}
                      as="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-secondary"
                      size="sm"
                      style={{ borderColor: social.color, color: social.color }}
                    >
                      {social.icon}
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaQuestionCircle className="me-2" />
                  Response Times
                </h5>
              </Card.Header>
              <Card.Body>
                {supportCategories.map((category, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <span className="text-primary me-2">{category.icon}</span>
                      <strong>{category.title}</strong>
                    </div>
                    <small className="text-muted d-block ms-4 mb-1">
                      {category.description}
                    </small>
                    <small className="text-success d-block ms-4">
                      Response: {category.responseTime}
                    </small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h3 className="mb-0">
                  <FaQuestionCircle className="me-2" />
                  Frequently Asked Questions
                </h3>
              </Card.Header>
              <Card.Body className="p-0">
                <Accordion flush>
                  {faqData.map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>
                        <strong>{faq.question}</strong>
                      </Accordion.Header>
                      <Accordion.Body className="text-muted">
                        {faq.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="mb-4">
          <Col className="text-center">
            <Card className="border-0 shadow-sm bg-primary text-white">
              <Card.Body className="p-4">
                <h3 className="mb-3">Still Have Questions?</h3>
                <p className="mb-3">
                  Can't find what you're looking for? Our team is here to help you get the most out of CONNECT.
                </p>
                <Button variant="light" size="lg" className="me-2">
                  <FaHeadset className="me-2" />
                  Live Chat
                </Button>
                <Button variant="outline-light" size="lg">
                  <FaEnvelope className="me-2" />
                  Email Support
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
