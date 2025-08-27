import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaPlus,
  FaUpload,
  FaGlobe,
  FaShareAlt,
  FaEnvelope,
  FaEdit,
  FaRocket,
  FaStar,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaImage,
  FaUser,
  FaFileAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaLink,
  FaTimes,
} from "react-icons/fa";

const ExpertCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    experience_years: "",
    website: "",
    social_media: "",
    email: "",
    profile_picture: null,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (!token) {
        setError("Please log in to create an expert profile");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      if (userType !== "expert") {
        setError("Only users registered as experts can create expert profiles");
        setIsAuthenticated(false);
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }

      setIsAuthenticated(true);
      try {
        // Check if user already has an expert profile
        const response = await api.get("/experts/my-profile/");
        setHasProfile(true);
        setError("You already have an expert profile");
      } catch (error) {
        if (error.response?.status === 404) {
          setHasProfile(false);
        } else {
          console.error("Error checking profile:", error);
          setError("Failed to check profile status");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ["name", "bio", "expertise", "experience_years"];
    const filledFields = requiredFields.filter(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );
    const progress = (filledFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!formData.expertise.trim()) {
      newErrors.expertise = "Expertise is required";
    }

    if (!formData.experience_years || formData.experience_years < 0) {
      newErrors.experience_years = "Experience years must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture" && files?.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setError("");
  };

  const removeImage = () => {
    setFormData({ ...formData, profile_picture: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setErrors({});

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("bio", formData.bio);
      submitData.append("expertise", formData.expertise);
      submitData.append("experience_years", formData.experience_years);

      if (formData.website) {
        submitData.append("website", formData.website);
      }

      if (formData.social_media) {
        submitData.append("social_media", formData.social_media);
      }

      if (formData.email) {
        submitData.append("email", formData.email);
      }

      if (formData.profile_picture) {
        submitData.append("profile_picture", formData.profile_picture);
      }

      const response = await api.post("/experts/create/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/experts");
      }, 2000);
    } catch (error) {
      console.error("Expert creation error:", error);

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle field-specific validation errors
        if (typeof errorData === "object" && !errorData.detail) {
          const fieldErrors = {};
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              fieldErrors[key] = errorData[key][0];
            }
          });
          setErrors(fieldErrors);
        } else {
          setError(errorData.detail || "Failed to create expert profile");
        }
      } else {
        setError(
          "An error occurred while creating your profile. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="expert-create-page-modern">
        <div className="auth-required-section">
          <Container>
            <div className="auth-required-card">
              <div className="auth-required-icon">
                <FaUserTie />
              </div>
              <h2 className="auth-required-title">Authentication Required</h2>
              <p className="auth-required-subtitle">
                Please log in to create your expert profile. This ensures your
                profile is properly linked to your account.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (hasProfile) {
    return (
      <div className="expert-create-page-modern">
        <div className="profile-exists-section">
          <Container>
            <div className="profile-exists-card">
              <div className="profile-exists-icon">
                <FaCheckCircle />
              </div>
              <h2 className="profile-exists-title">Profile Already Exists</h2>
              <p className="profile-exists-subtitle">
                You already have an expert profile. You cannot create another
                one. You can view and edit your existing profile instead.
              </p>
              <div className="profile-exists-actions">
                <Button
                  variant="primary"
                  size="lg"
                  className="view-profile-btn"
                  onClick={() => navigate("/experts")}
                >
                  <FaUserTie className="me-2" />
                  View My Profile
                </Button>
                <Button
                  variant="outline-secondary"
                  className="back-btn"
                  onClick={() => navigate("/")}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="expert-create-page-modern">
      {/* Hero Section */}
      <div className="create-hero">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <FaUserTie />
              <span>Create Expert Profile</span>
            </div>
            <h1 className="hero-title">
              Showcase Your <span className="gradient-text">Expertise</span>
            </h1>
            <p className="hero-subtitle">
              Build a professional expert profile, connect with clients, and
              grow your business. Join our network of trusted professionals.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">
                  <FaUsers />
                </div>
                <div className="stat-label">Global Network</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaAward />
                </div>
                <div className="stat-label">Verified Experts</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaStar />
                </div>
                <div className="stat-label">Quality Standards</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-5">
        <div className="create-form-section">
          {/* Form Progress */}
          <div className="form-progress-section">
            <div className="progress-header">
              <h3 className="progress-title">
                <FaEdit className="me-2" />
                Expert Profile Details
              </h3>
              <div className="progress-info">
                <span className="progress-text">Form Progress</span>
                <span className="progress-percentage">
                  {Math.round(formProgress)}%
                </span>
              </div>
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
              Expert profile created successfully! Redirecting to experts
              page...
            </Alert>
          )}

          {/* Create Form */}
          <Form onSubmit={handleSubmit} className="create-form">
            <div className="form-grid">
              {/* Profile Picture Field */}
              <div className="form-group featured">
                <Form.Label className="form-label">
                  <FaImage className="label-icon" />
                  Profile Picture
                </Form.Label>
                <div className="image-upload-section">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Profile picture preview"
                        className="image-preview"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="remove-image-btn"
                        onClick={removeImage}
                      >
                        <FaTimes className="me-1" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="image-upload-area">
                      <Form.Control
                        type="file"
                        name="profile_picture"
                        onChange={handleChange}
                        accept="image/*"
                        className="image-input"
                      />
                      <div className="upload-placeholder">
                        <FaUpload className="upload-icon" />
                        <p className="upload-text">
                          <strong>Click to upload</strong> or drag and drop
                        </p>
                        <p className="upload-subtext">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <small className="form-help">
                  Upload a professional profile picture (recommended: 400x400px)
                </small>
              </div>

              {/* Name Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaUser className="label-icon" />
                  Full Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Enter your full name"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
                <small className="form-help">
                  Your name as you want it to appear on your profile
                </small>
              </div>

              {/* Expertise Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaBriefcase className="label-icon" />
                  Expertise *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  isInvalid={!!errors.expertise}
                  placeholder="e.g., Digital Marketing, Web Development"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.expertise}
                </Form.Control.Feedback>
                <small className="form-help">
                  Your main area of expertise or specialization
                </small>
              </div>

              {/* Experience Years Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaCalendarAlt className="label-icon" />
                  Years of Experience *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  isInvalid={!!errors.experience_years}
                  min="0"
                  placeholder="Enter years of experience"
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.experience_years}
                </Form.Control.Feedback>
                <small className="form-help">
                  Number of years you've been working in your field
                </small>
              </div>

              {/* Bio Field */}
              <div className="form-group featured">
                <Form.Label className="form-label">
                  <FaFileAlt className="label-icon" />
                  Professional Bio *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  isInvalid={!!errors.bio}
                  placeholder="Tell us about your professional background, achievements, and what makes you an expert in your field..."
                  className="form-input"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.bio}
                </Form.Control.Feedback>
                <small className="form-help">
                  Write a compelling bio that highlights your expertise and
                  experience
                </small>
              </div>

              {/* Website Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaGlobe className="label-icon" />
                  Website
                </Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://your-website.com"
                  className="form-input"
                />
                <small className="form-help">
                  Your professional website or portfolio (optional)
                </small>
              </div>

              {/* Social Media Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaShareAlt className="label-icon" />
                  Social Media
                </Form.Label>
                <Form.Control
                  type="text"
                  name="social_media"
                  value={formData.social_media}
                  onChange={handleChange}
                  placeholder="LinkedIn, Twitter, or other profiles"
                  className="form-input"
                />
                <small className="form-help">
                  Your professional social media profiles (optional)
                </small>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaEnvelope className="label-icon" />
                  Contact Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="form-input"
                />
                <small className="form-help">
                  Contact email for potential clients (optional)
                </small>
              </div>
            </div>

            {/* Submit Section */}
            <div className="submit-section">
              <div className="submit-info">
                <div className="info-item">
                  <FaCheckCircle className="info-icon" />
                  <span>Your profile will be reviewed by our team</span>
                </div>
                <div className="info-item">
                  <FaRocket className="info-icon" />
                  <span>Quick approval process (usually within 24 hours)</span>
                </div>
                <div className="info-item">
                  <FaUsers className="info-icon" />
                  <span>Connect with clients and grow your business</span>
                </div>
              </div>

              <div className="submit-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="submit-btn"
                >
                  {isLoading ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Creating...</span>
                      </div>
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <FaRocket className="me-2" />
                      Create Expert Profile
                    </>
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  className="cancel-btn"
                  onClick={() => navigate("/experts")}
                >
                  <FaArrowLeft className="me-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Container>

      <style jsx>{`
        .expert-create-page-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .create-hero {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1.5rem 0;
          color: white;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #ffd700;
          font-weight: 600;
        }

        .hero-title {
          font-size: 2.2rem;
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
          font-size: 1rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.8rem;
          color: #ffd700;
          margin-bottom: 0.3rem;
        }

        .stat-label {
          font-size: 0.85rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .create-form-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          margin-bottom: 3rem;
        }

        .form-progress-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(102, 126, 234, 0.1);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .progress-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .progress-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #666;
        }

        .progress-percentage {
          font-size: 1.5rem;
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

        .create-form {
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
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

        .form-input {
          border-radius: 15px;
          border: 2px solid #e9ecef;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }

        .form-input.is-invalid {
          border-color: #dc3545;
        }

        .form-help {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          display: block;
        }

        .image-upload-section {
          margin-top: 0.5rem;
        }

        .image-preview-container {
          text-align: center;
        }

        .image-preview {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 15px;
          margin-bottom: 1rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .remove-image-btn {
          border-radius: 20px;
          padding: 0.5rem 1rem;
        }

        .image-upload-area {
          position: relative;
          border: 2px dashed #ddd;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(102, 126, 234, 0.02);
        }

        .image-upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .image-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-placeholder {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 3rem;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .upload-text {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .upload-subtext {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
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
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .cancel-btn {
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
        }

        .auth-required-section,
        .profile-exists-section {
          padding: 4rem 0;
        }

        .auth-required-card,
        .profile-exists-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .auth-required-icon,
        .profile-exists-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          margin: 0 auto 2rem;
        }

        .auth-required-icon {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
        }

        .profile-exists-icon {
          background: linear-gradient(45deg, #28a745, #20c997);
        }

        .auth-required-title,
        .profile-exists-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .auth-required-subtitle,
        .profile-exists-subtitle {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .login-btn,
        .view-profile-btn {
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .login-btn:hover,
        .view-profile-btn:hover {
          transform: translateY(-2px);
        }

        .profile-exists-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .back-btn {
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.8rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 2rem;
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

          .create-form-section {
            padding: 2rem;
          }

          .auth-required-card,
          .profile-exists-card {
            padding: 2rem;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 1.5rem;
          }

          .hero-subtitle {
            font-size: 0.85rem;
          }

          .create-hero {
            padding: 1rem 0;
          }

          .create-form-section {
            padding: 1.5rem;
          }

          .auth-required-card,
          .profile-exists-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpertCreate;
