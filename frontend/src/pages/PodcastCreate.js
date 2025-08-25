import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  FaMicrophone,
  FaPlus,
  FaUpload,
  FaLink,
  FaEdit,
  FaRocket,
  FaStar,
  FaUsers,
  FaPlay,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaImage,
  FaTag,
  FaFileAlt,
  FaGlobe
} from "react-icons/fa";

const PodcastCreate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        await api.get("/podcasts/profiles/");
        setNeedsProfile(false);
      } catch (error) {
        if (error.response?.status === 404) {
          setNeedsProfile(true);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get("/podcasts/categories/");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    checkProfile();
    fetchCategories();
  }, []);

  // Calculate form progress
  useEffect(() => {
    const fields = ['title', 'description', 'category_id'];
    const filledFields = fields.filter(field => formData[field] && formData[field].toString().trim() !== '');
    const progress = (filledFields.length / fields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create FormData to handle file uploads
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('link', formData.link);
      submitData.append('category_id', formData.category_id);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      await api.post("/podcasts/create/", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success("Podcast created successfully! It will be published after admin approval.");
      navigate("/podcasts");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  if (needsProfile) {
    return (
      <div className="podcast-create-page-modern">
        <div className="needs-profile-section">
          <Container>
            <div className="profile-required-card">
              <div className="profile-required-icon">
                <FaUsers />
              </div>
              <h2 className="profile-required-title">Profile Required</h2>
              <p className="profile-required-subtitle">
                You need to create a podcaster profile before creating your first podcast.
                This helps us understand your background and expertise.
              </p>
              <div className="profile-required-features">
                <div className="feature-item">
                  <FaStar className="feature-icon" />
                  <span>Build your professional identity</span>
                </div>
                <div className="feature-item">
                  <FaMicrophone className="feature-icon" />
                  <span>Showcase your expertise</span>
                </div>
                <div className="feature-item">
                  <FaUsers className="feature-icon" />
                  <span>Connect with listeners</span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="create-profile-btn"
                onClick={() => navigate("/podcasts/profile/create")}
              >
                <FaPlus className="me-2" />
                Create Podcaster Profile
              </Button>
              <Button
                variant="outline-secondary"
                className="back-btn"
                onClick={() => navigate("/podcasts")}
              >
                <FaArrowLeft className="me-2" />
                Back to Podcasts
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-create-page-modern">
      {/* Hero Section */}
      <div className="create-hero">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <FaMicrophone />
              <span>Create Your Podcast</span>
            </div>
            <h1 className="hero-title">
              Share Your Voice with the{" "}
              <span className="gradient-text">World</span>
            </h1>
            <p className="hero-subtitle">
              Create engaging podcast content, reach your audience, and build your 
              personal brand. Start your podcasting journey today.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">
                  <FaUsers />
                </div>
                <div className="stat-label">Global Audience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaPlay />
                </div>
                <div className="stat-label">Easy Publishing</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <FaStar />
                </div>
                <div className="stat-label">Quality Control</div>
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
                Podcast Details
              </h3>
              <div className="progress-info">
                <span className="progress-text">Form Progress</span>
                <span className="progress-percentage">{Math.round(formProgress)}%</span>
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

          {/* Create Form */}
          <Form onSubmit={handleSubmit} className="create-form">
            <div className="form-grid">
              {/* Title Field */}
              <div className="form-group featured">
                <Form.Label className="form-label">
                  <FaMicrophone className="label-icon" />
                  Podcast Title *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter your podcast title..."
                  className="form-input"
                />
                <small className="form-help">
                  Choose a catchy, memorable title that reflects your content
                </small>
              </div>

              {/* Description Field */}
              <div className="form-group featured">
                <Form.Label className="form-label">
                  <FaFileAlt className="label-icon" />
                  Description *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe what your podcast is about, who it's for, and what listeners can expect..."
                  className="form-input"
                />
                <small className="form-help">
                  Write a compelling description that will attract your target audience
                </small>
              </div>

              {/* Category Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaTag className="label-icon" />
                  Category *
                </Form.Label>
                <Form.Select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <small className="form-help">
                  Choose the category that best fits your podcast content
                </small>
              </div>

              {/* Link Field */}
              <div className="form-group">
                <Form.Label className="form-label">
                  <FaLink className="label-icon" />
                  Podcast Link
                </Form.Label>
                <Form.Control
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://your-podcast-platform.com/episode"
                  className="form-input"
                />
                <small className="form-help">
                  Optional: Link to your podcast on other platforms
                </small>
              </div>

              {/* Image Upload Field */}
              <div className="form-group featured">
                <Form.Label className="form-label">
                  <FaImage className="label-icon" />
                  Cover Image
                </Form.Label>
                <div className="image-upload-section">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img 
                        src={imagePreview} 
                        alt="Podcast cover preview" 
                        className="image-preview"
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="remove-image-btn"
                        onClick={removeImage}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="image-upload-area">
                      <Form.Control
                        type="file"
                        name="image"
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
                  Upload a high-quality cover image (recommended: 1400x1400px)
                </small>
              </div>
            </div>

            {/* Submit Section */}
            <div className="submit-section">
              <div className="submit-info">
                <div className="info-item">
                  <FaCheckCircle className="info-icon" />
                  <span>Your podcast will be reviewed by our team</span>
                </div>
                <div className="info-item">
                  <FaRocket className="info-icon" />
                  <span>Quick approval process (usually within 24 hours)</span>
                </div>
                <div className="info-item">
                  <FaGlobe className="info-icon" />
                  <span>Reach a global audience of podcast enthusiasts</span>
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
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Creating...</span>
                      </div>
                      Creating Podcast...
                    </>
                  ) : (
                    <>
                      <FaRocket className="me-2" />
                      Create Podcast
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline-secondary"
                  className="cancel-btn"
                  onClick={() => navigate("/podcasts")}
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
        .podcast-create-page-modern {
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
          padding: 3rem 0;
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
        
        .error-alert {
          border-radius: 15px;
          border: none;
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          margin-bottom: 2rem;
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
        
        .form-input,
        .form-select {
          border-radius: 15px;
          border: 2px solid #e9ecef;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus,
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
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
        
        .needs-profile-section {
          padding: 4rem 0;
        }
        
        .profile-required-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 25px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .profile-required-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          margin: 0 auto 2rem;
        }
        
        .profile-required-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }
        
        .profile-required-subtitle {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        
        .profile-required-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 15px;
          color: #333;
        }
        
        .feature-icon {
          color: #667eea;
          font-size: 1.2rem;
        }
        
        .create-profile-btn {
          border-radius: 25px;
          padding: 1rem 2rem;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        
        .create-profile-btn:hover {
          transform: translateY(-2px);
        }
        
        .back-btn {
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
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
          
          .profile-required-card {
            padding: 2rem;
          }
        }
        
        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .create-hero {
            padding: 2rem 0;
          }
          
          .create-form-section {
            padding: 1.5rem;
          }
          
          .profile-required-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PodcastCreate;
