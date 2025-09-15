import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaMicrophone,
  FaUserTie,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
  FaRocket,
  FaUsers,
  FaStar,
  FaGlobe,
  FaKey,
  FaUserCheck,
  FaLightbulb,
  FaHandshake,
  FaNetworkWired,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    user_type: "podcaster",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const navigate = useNavigate();

  // Calculate form progress
  React.useEffect(() => {
    const requiredFields = ["username", "email", "password"];
    const filledFields = requiredFields.filter(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );
    const progress = (filledFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    // Clear field-specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setSuccess(false);
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending registration request:", formData);
      const response = await api.post("/users/register/", formData);
      console.log("Registration response:", response.data);
      setSuccess(true);
      // Store user type for later use
      localStorage.setItem("userType", formData.user_type);
      setTimeout(() => {
        navigate("/login");
      }, 10000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        // Handle specific error messages from the backend
        if (
          typeof error.response.data === "object" &&
          !error.response.data.detail
        ) {
          // Field-specific validation errors
          const fieldErrors = {};
          Object.keys(error.response.data).forEach((key) => {
            if (Array.isArray(error.response.data[key])) {
              fieldErrors[key] = error.response.data[key][0];
            } else {
              fieldErrors[key] = error.response.data[key];
            }
          });
          setErrors(fieldErrors);
        } else {
          setError(
            error.response.data.detail ||
              "Registration failed. Please try again."
          );
        }
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.message.includes("Network Error")) {
        setError(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page-modern">
      {/* Hero Section */}
      <div className="register-hero">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <FaUserPlus />
              <span>Join CONNECT</span>
            </div>
            <h1 className="hero-title">
              Start Your <span className="gradient-text">Professional</span>{" "}
              Journey
            </h1>
            <p className="hero-subtitle">
              Create your account and join our network of podcasters and
              experts. Build your professional presence, connect with others,
              and grow your business.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">
                  <FaUsers />
                </div>
                <div className="stat-label">Growing Community</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaStar />
                </div>
                <div className="stat-label">Quality Network</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaRocket />
                </div>
                <div className="stat-label">Fast Growth</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-5">
        <div className="register-form-section">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-header-icon">
              <FaUserPlus />
            </div>
            <h2 className="form-title">Create Your Account</h2>
            <p className="form-subtitle">
              Join our professional network and start building your presence
            </p>
          </div>

          {/* Form Progress */}
          <div className="form-progress-section">
            <div className="progress-header">
              <span className="progress-text">Form Progress</span>
              <span className="progress-percentage">
                {Math.round(formProgress)}%
              </span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="error-alert">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert variant="success" className="success-alert">
              <FaCheckCircle className="me-2" />
              Registration successful! Please check your email for verification.
              You will be redirected to the login page in 10 seconds. If you
              don't see the verification email, please check your spam folder.
            </Alert>
          )}

          {/* Registration Form */}
          <Form onSubmit={handleSubmit} className="register-form">
            {/* User Type Selection */}
            <div className="user-type-section">
              <h4 className="section-title">
                <FaUserCheck className="me-2" />
                Choose Your Path
              </h4>
              <p className="section-subtitle">
                Select how you want to join our professional network
              </p>
              <div className="user-type-cards">
                <div
                  className={`user-type-card ${
                    formData.user_type === "expert" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, user_type: "expert" })
                  }
                >
                  <div className="card-icon">
                    <FaUserTie />
                  </div>
                  <h5>Expert</h5>
                  <p>
                    Showcase your expertise, connect with clients, and build
                    your business
                  </p>
                  <div className="card-features">
                    <span className="feature-tag">Expert Profile</span>
                    <span className="feature-tag">Client Connections</span>
                    <span className="feature-tag">Professional Network</span>
                  </div>
                </div>
                <div
                  className={`user-type-card ${
                    formData.user_type === "podcaster" ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, user_type: "podcaster" })
                  }
                >
                  <div className="card-icon">
                    <FaMicrophone />
                  </div>
                  <h5>Podcaster</h5>
                  <p>
                    Create and manage your podcasts, reach audiences, and grow
                    your brand
                  </p>
                  <div className="card-features">
                    <span className="feature-tag">Content Creation</span>
                    <span className="feature-tag">Audience Growth</span>
                    <span className="feature-tag">Analytics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="account-details-section">
              <h4 className="section-title">
                <FaUser className="me-2" />
                Account Details
              </h4>
              <p className="section-subtitle">
                Set up your basic account information
              </p>

              <div className="form-grid">
                {/* Username Field */}
                <div className="form-group">
                  <Form.Label className="form-label">
                    <FaUser className="label-icon" />
                    Username
                  </Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      isInvalid={!!errors.username}
                      required
                      placeholder="Choose a unique username"
                      className="form-input"
                    />
                    <div className="input-icon">
                      <FaUser />
                    </div>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                  <small className="form-help">
                    This will be your unique identifier on the platform
                  </small>
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <Form.Label className="form-label">
                    <FaEnvelope className="label-icon" />
                    Email Address
                  </Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      required
                      placeholder="Enter your email address"
                      className="form-input"
                    />
                    <div className="input-icon">
                      <FaEnvelope />
                    </div>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <small className="form-help">
                    We'll send a verification email to this address
                  </small>
                </div>

                {/* Password Field */}
                <div className="form-group featured">
                  <Form.Label className="form-label">
                    <FaLock className="label-icon" />
                    Password
                  </Form.Label>
                  <div className="input-container">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      required
                      placeholder="Create a strong password"
                      className="form-input"
                    />
                    <div className="input-icon">
                      <FaKey />
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="password-toggle-btn"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <small className="form-help">
                    Password must be at least 8 characters long
                  </small>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="submit-section">
              <div className="submit-info">
                <div className="info-item">
                  <FaShieldAlt className="info-icon" />
                  <span>Your data is secure and encrypted</span>
                </div>
                <div className="info-item">
                  <FaCheckCircle className="info-icon" />
                  <span>Free to join, no hidden fees</span>
                </div>
                <div className="info-item">
                  <FaUsers className="info-icon" />
                  <span>Join thousands of professionals</span>
                </div>
              </div>

              <div className="submit-actions">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="submit-btn"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Creating...</span>
                      </div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" />
                      Create Account
                    </>
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  className="cancel-btn"
                  onClick={() => navigate("/login")}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Login
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaLightbulb />
              </div>
              <h4>Smart Matching</h4>
              <p>
                Connect with the right people using our intelligent matching
                system
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHandshake />
              </div>
              <h4>Professional Network</h4>
              <p>Build meaningful connections with industry professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaNetworkWired />
              </div>
              <h4>Global Reach</h4>
              <p>Access opportunities from anywhere in the world</p>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .register-page-modern {
          min-height: 100vh;
          background: #819dde;
        }

        .register-hero {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3rem 0;
          color: white;
          text-align: center;
          border-radius: 10px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          margin-bottom: 2rem;
          font-size: 1rem;
          color: #ffd700;
          font-weight: 600;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          color: #ffd700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .register-form-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .form-header-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .form-progress-section {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .progress-percentage {
          font-size: 1.2rem;
          font-weight: 700;
          color: #667eea;
        }

        .progress-bar-container {
          width: 100%;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .error-alert,
        .success-alert {
          border-radius: 15px;
          border: none;
          margin-bottom: 2rem;
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .success-alert {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }

        .register-form {
          margin: 0;
        }

        .user-type-section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }

        .section-title {
          display: flex;
          align-items: center;
          font-size: 1.3rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .user-type-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .user-type-card {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .user-type-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.1);
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(10px);
        }

        .user-type-card.selected {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.15);
        }

        .user-type-card.selected::before {
          content: "✓";
          position: absolute;
          top: clamp(-8px, -2vw, -10px);
          right: clamp(-8px, -2vw, -10px);
          width: clamp(25px, 6vw, 30px);
          height: clamp(25px, 6vw, 30px);
          background: #667eea;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }

        .user-type-card h5 {
          color: #333;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .user-type-card p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .feature-tag {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .account-details-section {
          margin-bottom: 3rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .form-group.featured {
          grid-column: 1 / -1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .label-icon {
          color: #667eea;
          font-size: 1rem;
        }

        .input-container {
          position: relative;
        }

        .form-input {
          border-radius: 15px;
          border: 2px solid #e9ecef;
          padding: 1rem 3rem 1rem 2.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          width: 100%;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }

        .input-icon {
          position: absolute;
          left: clamp(0.75rem, 2vw, 1rem);
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          font-size: clamp(1rem, 2.5vw, 1.1rem);
        }

        .password-toggle-btn {
          position: absolute;
          right: clamp(0.75rem, 2vw, 1rem);
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          padding: 0;
          border: none;
          background: none;
          font-size: clamp(1rem, 2.5vw, 1.1rem);
        }

        .password-toggle-btn:hover {
          color: #764ba2;
        }

        .form-help {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          display: block;
        }

        .submit-section {
          border-top: 2px solid rgba(102, 126, 234, 0.1);
          padding-top: 2rem;
        }

        .submit-info {
          display: flex;
          justify-content: space-around;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #333;
          font-size: 0.95rem;
        }

        .info-icon {
          color: #667eea;
          font-size: 1.1rem;
        }

        .submit-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }

        .submit-btn {
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
        }

        .cancel-btn {
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
        }

        .features-section {
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          margin: 0 auto 1.5rem;
        }

        .feature-card h4 {
          color: #333;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 1200px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .register-form-section {
            max-width: 700px;
          }

          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.6rem;
          }

          .hero-stats {
            gap: 1rem;
          }

          .register-form-section {
            max-width: 600px;
            padding: 2.5rem;
          }

          .form-grid {
            gap: 1.5rem;
          }

          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .register-form-section {
            padding: 2rem;
            margin: 2rem 1rem;
          }

          .user-type-cards {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .submit-info {
            flex-direction: column;
            gap: 1rem;
          }

          .submit-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .submit-btn,
          .cancel-btn {
            width: 100%;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .register-hero {
            padding: 2rem 0;
          }

          .register-form-section {
            padding: 1.5rem;
            margin: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .register-hero {
            padding: 1.5rem 0;
          }

          .register-form-section {
            padding: 1rem;
            margin: 0.5rem;
          }

          .form-header-icon {
            width: clamp(60px, 15vw, 80px);
            height: clamp(60px, 15vw, 80px);
            font-size: clamp(1.5rem, 4vw, 2rem);
          }

          .card-icon {
            width: clamp(50px, 12vw, 60px);
            height: clamp(50px, 12vw, 60px);
            font-size: clamp(1.2rem, 3vw, 1.5rem);
          }

          .user-type-card.selected::before {
            width: clamp(25px, 6vw, 30px);
            height: clamp(25px, 6vw, 30px);
            font-size: clamp(1rem, 2.5vw, 1.2rem);
          }

          .feature-icon {
            width: clamp(60px, 15vw, 70px);
            height: clamp(60px, 15vw, 70px);
            font-size: clamp(1.5rem, 4vw, 1.8rem);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
