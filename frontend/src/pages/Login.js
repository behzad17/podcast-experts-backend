import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaShieldAlt,
  FaRocket,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEnvelope,
  FaKey,
  FaUserTie,
} from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate("/profile");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-modern">
      {/* Hero Section */}
      <div className="login-hero">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <FaSignInAlt />
              <span>Welcome Back</span>
            </div>
            <h1 className="hero-title">
              Ready to <span className="gradient-text">Connect</span> Again?
            </h1>
            <p className="hero-subtitle">
              Access your expert profile, manage your podcasts, and continue
              building meaningful connections in our professional network.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">
                  <FaUsers />
                </div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaStar />
                </div>
                <div className="stat-label">Trusted Platform</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaRocket />
                </div>
                <div className="stat-label">Fast & Secure</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-5">
        <div className="login-form-section">
          {/* Form Header */}
          <div className="form-header">
            <div className="form-header-icon">
              <FaUserTie />
            </div>
            <h2 className="form-title">Sign In to Your Account</h2>
            <p className="form-subtitle">
              Enter your credentials to access your professional profile
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="error-alert">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="form-group">
              <Form.Label className="form-label">
                <FaUser className="label-icon" />
                Username or Email
              </Form.Label>
              <div className="input-container">
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username or email"
                  className="form-input"
                />
                <div className="input-icon">
                  <FaEnvelope />
                </div>
              </div>
              <small className="form-help">
                Use the username or email you registered with
              </small>
            </div>

            {/* Password Field */}
            <div className="form-group">
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
                  required
                  placeholder="Enter your password"
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
              <small className="form-help">
                Your password is encrypted and secure
              </small>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <div className="remember-me">
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember me for 30 days"
                  className="custom-checkbox"
                />
              </div>
              <div className="forgot-password">
                <a href="/forgot-password" className="forgot-link">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
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
                      <span className="visually-hidden">Logging in...</span>
                    </div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="me-2" />
                    Sign In
                  </>
                )}
              </Button>
            </div>

            {/* Registration Link */}
            <div className="registration-section">
              <div className="registration-content">
                <div className="registration-icon">
                  <FaUserTie />
                </div>
                <div className="registration-text">
                  <h4>New to CONNECT?</h4>
                  <p>
                    Join our professional network and start building your expert
                    profile
                  </p>
                </div>
              </div>
              <Button
                variant="outline-success"
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                <FaArrowRight className="me-2" />
                Create Account
              </Button>
            </div>
          </Form>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h4>Secure & Private</h4>
              <p>Your data is protected with enterprise-grade security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h4>Fast Access</h4>
              <p>Quick login and instant access to your professional tools</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h4>Professional Network</h4>
              <p>Connect with experts and grow your professional presence</p>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .login-page-modern {
          min-height: 100vh;
          background: #819dde;
        }

        .login-hero {
          background: rgba(255, 255, 255, 0.1);
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
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          margin-bottom: 2rem;
          font-size: 1rem;
          color: white;
          font-weight: 600;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: white;
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
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          color: #ffd700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .login-form-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          margin-bottom: 3rem;
          max-width: 600px;
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

        .error-alert {
          border-radius: 15px;
          border: none;
          margin-bottom: 2rem;
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .login-form {
          margin: 0;
        }

        .form-group {
          margin-bottom: 2rem;
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
          padding: 1rem 3rem 1rem 1.25rem;
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
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          font-size: 1.1rem;
        }

        .password-toggle-btn {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          padding: 0;
          border: none;
          background: none;
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

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .custom-checkbox {
          margin: 0;
        }

        .custom-checkbox .form-check-input {
          border-radius: 4px;
          border: 2px solid #667eea;
        }

        .custom-checkbox .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
        }

        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .submit-section {
          margin-bottom: 2rem;
        }

        .submit-btn {
          width: 100%;
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
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

        .auth-required-section,
        .registration-section {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .registration-content {
          margin-bottom: 1.5rem;
        }

        .registration-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(45deg, #28a745, #20c997);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          margin: 0 auto 1rem;
        }

        .registration-text h4 {
          color: #333;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .registration-text p {
          color: #666;
          margin: 0;
          font-size: 0.95rem;
        }

        .register-btn {
          border-radius: 25px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          border: 2px solid #28a745;
          color: #28a745;
          transition: all 0.3s ease;
        }

        .register-btn:hover {
          background: #28a745;
          color: white;
          transform: translateY(-2px);
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

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 2rem;
          }

          .login-form-section {
            padding: 2rem;
            margin: 2rem 1rem;
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

          .login-hero {
            padding: 2rem 0;
          }

          .login-form-section {
            padding: 1.5rem;
            margin: 1rem;
          }

          .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .login-hero {
            padding: 1.5rem 0;
          }

          .login-form-section {
            padding: 1rem;
            margin: 0.5rem;
          }

          .form-header-icon {
            width: clamp(60px, 15vw, 80px);
            height: clamp(60px, 15vw, 80px);
            font-size: clamp(1.5rem, 4vw, 2rem);
          }

          .registration-icon {
            width: clamp(50px, 12vw, 60px);
            height: clamp(50px, 12vw, 60px);
            font-size: clamp(1.2rem, 3vw, 1.5rem);
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

export default Login;
