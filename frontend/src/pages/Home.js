import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "../api/axios";
import { Link } from "react-router-dom";

import Footer from "../components/common/Footer";
import { useAuth } from "../contexts/AuthContext";
import {
  FaMicrophone,
  FaUsers,
  FaHandshake,
  FaRocket,
  FaLightbulb,
  FaStar,
  FaComments,
  FaBookmark,
  FaChartLine,
  FaGlobe,
  FaPlay,
  FaHeart,
  FaArrowRight,
  FaCrown,
  FaShieldAlt,
  FaLightbulb as FaBulb,
  FaNetworkWired,
  FaUserTie,
  FaPodcast,
  FaSearch,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [featuredExperts, setFeaturedExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const [podcastsRes, expertsRes] = await Promise.allSettled([
          axios.get("/podcasts/featured/"),
          axios.get("/experts/featured/"),
        ]);

        if (podcastsRes.status === "fulfilled") {
          setFeaturedPodcasts(podcastsRes.value.data);
        }

        if (expertsRes.status === "fulfilled") {
          setFeaturedExperts(expertsRes.value.data);
        }
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const getExpertImage = (expert) => {
    if (
      expert.profile_picture_url &&
      expert.profile_picture_url.startsWith("http")
    ) {
      return expert.profile_picture_url;
    }

    if (expert.profile_picture && expert.profile_picture.startsWith("http")) {
      return expert.profile_picture;
    }

    return "/logo192.png";
  };

  const getPodcastImageUrl = (podcast) => {
    if (podcast.image && podcast.image.startsWith("http")) {
      return podcast.image;
    }
    return "/logo192.png";
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <p>Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-modern">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <Row className="justify-content-center text-center">
            <Col lg={10}>
              <div className="hero-badge">
                <FaCrown className="hero-icon" />
                <span>Sweden's Premier Platform</span>
              </div>
              <h1 className="hero-title">
                Connect with <span className="gradient-text">Experts</span> &{" "}
                <span className="gradient-text">Podcasters</span>
              </h1>
              <p className="hero-subtitle">
                The ultimate platform for podcast creators and subject matter
                experts to collaborate, innovate, and create extraordinary
                content together.
              </p>
              {user && (
                <div className="user-welcome">
                  <FaUserTie className="user-icon" />
                  <span>
                    Welcome back, {user.username}! You are logged in as{" "}
                    {user.user_type === "expert" ? "an Expert" : "a Podcaster"}.
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="main-content">
        {/* Featured Experts Section */}
        <section className="section-modern experts-section">
          <div className="section-header">
            <div className="section-icon">
              <FaUsers />
            </div>
            <h2 className="section-title">Expert Spotlights</h2>
            <p className="section-subtitle">
              Discover brilliant minds ready to share their expertise on your
              podcast
            </p>
          </div>

          <Row className="g-3">
            {loading ? (
              <Col className="text-center">
                <div className="loading-placeholder">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </Col>
            ) : featuredExperts.length > 0 ? (
              featuredExperts.map((expert) => (
                <Col key={expert.id} lg={2} md={4} sm={6}>
                  <Card className="expert-card-modern compact">
                    <div className="expert-card-header">
                      <div className="expert-image-container">
                        <img
                          src={getExpertImage(expert)}
                          alt={expert.name}
                          className="expert-image"
                        />
                        <div className="expert-badge">
                          <FaStar />
                        </div>
                      </div>
                      <div className="expert-info">
                        <h3 className="expert-name">{expert.name}</h3>
                        <p className="expert-bio">
                          {expert.bio?.substring(0, 40)}...
                        </p>
                        <div className="expert-stats">
                          <span className="stat">
                            <FaHeart />
                            {expert.likes_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="expert-card-actions">
                      <Link
                        to={`/experts/${expert.id}`}
                        className="btn btn-primary-modern btn-full"
                      >
                        <FaUserTie className="me-2" />
                        View Profile
                      </Link>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <div className="empty-state">
                  <FaUsers className="empty-icon" />
                  <p>No featured experts available yet</p>
                </div>
              </Col>
            )}
          </Row>
        </section>

        {/* Featured Podcasts Section */}
        <section className="section-modern podcasts-section">
          <div className="section-header">
            <div className="section-icon">
              <FaMicrophone />
            </div>
            <h2 className="section-title">Featured Podcasts</h2>
            <p className="section-subtitle">
              Discover amazing podcasts that are making waves in the industry
            </p>
          </div>

          <Row className="g-3">
            {loading ? (
              <Col className="text-center">
                <div className="loading-placeholder">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </Col>
            ) : featuredPodcasts.length > 0 ? (
              featuredPodcasts.map((podcast) => (
                <Col key={podcast.id} lg={2} md={4} sm={6}>
                  <Card className="podcast-card-modern compact">
                    <div className="podcast-image-container">
                      <img
                        src={getPodcastImageUrl(podcast)}
                        alt={podcast.title}
                        className="podcast-image"
                      />
                      <div className="podcast-overlay">
                        <FaPlay className="play-icon" />
                      </div>
                      <div className="podcast-badge">
                        <FaStar />
                      </div>
                    </div>
                    <Card.Body className="podcast-body">
                      <h3 className="podcast-title">{podcast.title}</h3>
                      <p className="podcast-description">
                        {podcast.description?.substring(0, 50)}...
                      </p>

                      <div className="podcast-actions">
                        <Link
                          to={`/podcasts/${podcast.id}`}
                          className="btn btn-primary-modern btn-full"
                        >
                          <FaPlay className="me-2" />
                          Listen Now
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <div className="empty-state">
                  <FaMicrophone className="empty-icon" />
                  <p>No featured podcasts available yet</p>
                </div>
              </Col>
            )}
          </Row>
        </section>

        {/* Platform Description Boxes */}
        <section className="section-modern description-section">
          <Row className="g-4">
            <Col lg={6}>
              <Card className="description-card-modern expert-desc">
                <div className="card-icon">
                  <FaUserTie />
                </div>
                <Card.Body>
                  <h3 className="card-title">For Experts</h3>
                  <p className="card-text">
                    Get booked on podcasts to expand your reach and audience.
                    Join our exclusive newsletter featuring 20+ podcasts looking
                    for guests each week. Plus, join our premium expert
                    directory so podcasters can discover you.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="description-card-modern podcaster-desc">
                <div className="card-icon">
                  <FaPodcast />
                </div>
                <Card.Body>
                  <h3 className="card-title">For Podcasters</h3>
                  <p className="card-text">
                    Find exceptional experts to be guests on your podcast from
                    our Guest Directory. Get featured in our newsletter that
                    reaches thousands of experts and podcasters looking for
                    collaboration opportunities.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Our Mission Section */}
        <section className="section-modern mission-section">
          <div className="section-header text-center">
            <div className="section-icon large">
              <FaLightbulb />
            </div>
            <h2 className="section-title">Our Mission</h2>
            <p className="section-subtitle">
              We're on a mission to revolutionize podcast collaboration
            </p>
          </div>

          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="mission-card-modern">
                <Card.Body>
                  <div className="mission-content">
                    <div className="mission-text">
                      <p className="mission-highlight">
                        <strong>CONNECT</strong> is dedicated to bridging the
                        gap between podcast creators and subject matter experts.
                        We believe that extraordinary content comes from
                        collaboration between passionate creators and
                        knowledgeable specialists.
                      </p>
                      <p className="mission-description">
                        Our platform serves as the ultimate hub where podcasters
                        can discover experts in various fields, and experts can
                        showcase their knowledge to reach wider audiences
                        through meaningful podcast collaborations.
                      </p>
                    </div>
                    <div className="mission-stats">
                      <div className="stat-item">
                        <FaUsers className="stat-icon" />
                        <div className="stat-content">
                          <span className="stat-number">1000+</span>
                          <span className="stat-label">Experts</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <FaMicrophone className="stat-icon" />
                        <div className="stat-content">
                          <span className="stat-number">500+</span>
                          <span className="stat-label">Podcasts</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <FaHandshake className="stat-icon" />
                        <div className="stat-content">
                          <span className="stat-number">2000+</span>
                          <span className="stat-label">Connections</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* How It Works Section */}
        <section className="section-modern how-it-works-section">
          <div className="section-header text-center">
            <div className="section-icon large">
              <FaRocket />
            </div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three simple steps to start your podcast collaboration journey
            </p>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="step-card-modern">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <FaSearch />
                </div>
                <h3 className="step-title">Discover</h3>
                <p className="step-description">
                  Browse through our curated list of podcasts and expert
                  profiles to find the perfect match for your needs. Use
                  advanced filters and search to narrow down your options.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="step-card-modern">
                <div className="step-number">2</div>
                <div className="step-icon">
                  <FaHandshake />
                </div>
                <h3 className="step-title">Connect</h3>
                <p className="step-description">
                  Reach out to experts or podcasters through our built-in
                  messaging system. Discuss collaboration opportunities, share
                  ideas, and plan your content together.
                </p>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="step-card-modern">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <FaUsers />
                </div>
                <h3 className="step-title">Collaborate</h3>
                <p className="step-description">
                  Work together to create amazing content that benefits both the
                  expert's reach and the podcaster's audience. Build lasting
                  professional relationships.
                </p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Platform Features Section */}
        <section className="section-modern features-section">
          <div className="section-header text-center">
            <div className="section-icon large">
              <FaStar />
            </div>
            <h2 className="section-title">Platform Features</h2>
            <p className="section-subtitle">
              Everything you need to succeed in podcast collaboration
            </p>
          </div>

          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="feature-card-modern">
                <div className="feature-icon">
                  <FaMicrophone />
                </div>
                <h3 className="feature-title">Podcast Discovery</h3>
                <p className="feature-description">
                  Advanced search and filtering to find the perfect podcasts for
                  your expertise
                </p>
                <div className="feature-tags">
                  <span className="tag">Category Filters</span>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-card-modern">
                <div className="feature-icon">
                  <FaUserTie />
                </div>
                <h3 className="feature-title">Expert Profiles</h3>
                <p className="feature-description">
                  Create compelling profiles that showcase your expertise and
                  experience
                </p>
                <div className="feature-tags">
                  <span className="tag">Portfolio Builder</span>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-card-modern">
                <div className="feature-icon">
                  <FaComments />
                </div>
                <h3 className="feature-title">Direct Messaging</h3>
                <p className="feature-description">
                  Built-in communication tools for seamless collaboration
                  planning
                </p>
                <div className="feature-tags">
                  <span className="tag">Real-time Chat</span>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-card-modern">
                <div className="feature-icon">
                  <FaBookmark />
                </div>
                <h3 className="feature-title">Bookmark System</h3>
                <p className="feature-description">
                  Save and organize your favorite experts and podcasts for easy
                  access
                </p>
                <div className="feature-tags">
                  <span className="tag">Quick Access</span>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-card-modern">
                <div className="feature-icon">
                  <FaChartLine />
                </div>
                <h3 className="feature-title">Content Curation</h3>
                <p className="feature-description">
                  Featured content and trending topics to inspire your next
                  collaboration
                </p>
                <div className="feature-tags">
                  <span className="tag">Featured Content</span>
                </div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="feature-card-modern">
                <div className="feature-icon">
                  <FaGlobe />
                </div>
                <h3 className="feature-title">Global Network</h3>
                <p className="feature-description">
                  Connect with experts and podcasters from around the world
                </p>
                <div className="feature-tags">
                  <span className="tag">Worldwide Reach</span>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        <Footer />
      </Container>

      {/* Custom CSS Styles */}
      <style jsx>{`
        .homepage-modern {
          background: linear-gradient(
            135deg,
            #f8f9fa 0%,
            #e3f2fd 50%,
            #f3e5f5 100%
          );
          min-height: 100vh;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 5px 0;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .hero-icon {
          color: #ffd700;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(45deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .user-welcome {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.15);
          padding: 1rem 2rem;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          font-weight: 600;
        }

        .user-icon {
          color: #ffd700;
        }

        /* Main Content */
        .main-content {
          padding: 4rem 0;
        }

        /* Section Styling */
        .section-modern {
          margin-bottom: 5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header.text-center {
          text-align: center;
        }

        .section-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 2rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .section-icon.large {
          width: 100px;
          height: 100px;
          font-size: 2.5rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #7f8c8d;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Expert Cards */
        .expert-card-modern {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          background: white;
        }

        .expert-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .expert-card-modern.compact {
          padding: 0.75rem;
          text-align: center;
        }

        .expert-card-modern.compact .expert-card-header {
          padding: 0.75rem;
        }

        .expert-card-modern.compact .expert-image-container {
          margin-bottom: 0.75rem;
          width: 100%;
          aspect-ratio: 1;
        }

        .expert-card-modern.compact .expert-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          aspect-ratio: 1;
        }

        .expert-card-modern.compact .expert-name {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .expert-card-modern.compact .expert-bio {
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .expert-card-modern.compact .expert-stats {
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .expert-card-modern.compact .expert-card-actions {
          padding: 0.75rem;
          flex-direction: column;
          gap: 0.5rem;
        }

        .expert-card-modern.compact .btn-primary-modern {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .expert-card-modern.compact .btn-like-modern {
          padding: 0.5rem;
          min-width: 40px;
        }

        /* Regular Expert Cards (for other sections) */
        .expert-card-header {
          padding: 1.5rem;
          position: relative;
        }

        .expert-image-container {
          position: relative;
          margin-bottom: 1rem;
          width: 100%;
          aspect-ratio: 1;
        }

        .expert-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          aspect-ratio: 1;
        }

        .expert-badge {
          position: absolute;
          top: -10px;
          right: -10px;
          background: linear-gradient(45deg, #ffd700, #ff6b6b);
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .expert-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .expert-bio {
          color: #7f8c8d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .expert-stats {
          display: flex;
          gap: 1rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e74c3c;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .expert-card-actions {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          display: flex;
          gap: 0.75rem;
        }

        /* Podcast Cards */
        .podcast-card-modern {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          background: white;
        }

        .podcast-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .podcast-card-modern.compact {
          text-align: center;
        }

        .podcast-card-modern.compact .podcast-image-container {
          position: relative;
          margin-bottom: 0.75rem;
          width: 100%;
          aspect-ratio: 1;
        }

        .podcast-card-modern.compact .podcast-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          aspect-ratio: 1;
        }

        .podcast-card-modern.compact .podcast-body {
          padding: 1rem;
        }

        .podcast-card-modern.compact .podcast-title {
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .podcast-card-modern.compact .podcast-description {
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .podcast-card-modern.compact .podcast-stats {
          margin-bottom: 0.75rem;
          justify-content: center;
        }

        .podcast-card-modern.compact .podcast-actions {
          flex-direction: column;
          gap: 0.5rem;
        }

        .podcast-card-modern.compact .btn-primary-modern {
          padding: 0.5rem 0.8rem;
          font-size: 0.8rem;
        }

        .podcast-card-modern.compact .btn-like-modern {
          padding: 0.5rem;
          min-width: 40px;
        }

        .podcast-image-container {
          position: relative;
          margin-bottom: 1rem;
          width: 100%;
          aspect-ratio: 1;
        }

        .podcast-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          aspect-ratio: 1;
        }

        .podcast-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .podcast-card-modern:hover .podcast-overlay {
          opacity: 1;
        }

        .play-icon {
          color: white;
          font-size: 3rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .podcast-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(45deg, #ffd700, #ff6b6b);
          color: white;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }

        .podcast-body {
          padding: 1.5rem;
        }

        .podcast-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .podcast-description {
          color: #7f8c8d;
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .podcast-stats {
          margin-bottom: 1rem;
        }

        .podcast-actions {
          display: flex;
          gap: 0.75rem;
        }

        /* Description Cards */
        .description-card-modern {
          position: relative;
          border: none;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          margin-top: 1.5rem;
        }

        .description-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
          position: absolute;
          top: -25px;
          right: 25px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          color: white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .expert-desc .card-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .podcaster-desc .card-icon {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          padding-top: 2rem;
        }

        .card-text {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .card-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #2c3e50;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .feature svg {
          color: #667eea;
        }

        /* Mission Section */
        .mission-card-modern {
          border: none;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .mission-content {
          padding: 2rem;
        }

        .mission-highlight {
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          opacity: 0.95;
        }

        .mission-description {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .mission-stats {
          display: flex;
          justify-content: space-around;
          gap: 2rem;
          margin-top: 2rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .stat-icon {
          font-size: 2rem;
          color: #ffd700;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffd700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* How It Works */
        .step-card-modern {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          height: 100%;
        }

        .step-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .step-number {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem auto 1.5rem;
          color: white;
          font-size: 2rem;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .step-description {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .step-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .feature-tag {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Features Section */
        .feature-card-modern {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }

        .feature-card-modern:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 1.8rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .feature-tags {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .tag {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Buttons */
        .btn-primary-modern {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          color: white;
          text-decoration: none;
        }

        .btn-full {
          width: 100%;
        }

        .btn-like-modern {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          border: none;
          border-radius: 25px;
          padding: 0.75rem;
          color: white;
          transition: all 0.3s ease;
          min-width: 45px;
        }

        .btn-like-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        }

        /* Loading States */
        .loading-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa, #e3f2fd);
        }

        .loading-spinner {
          text-align: center;
        }

        .spinner-ring {
          width: 60px;
          height: 60px;
          border: 4px solid #667eea;
          border-top: 4px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-placeholder {
          padding: 3rem;
        }

        .loading-dots {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .loading-dots span {
          width: 12px;
          height: 12px;
          background: #667eea;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        /* Empty States */
        .empty-state {
          padding: 3rem;
          text-align: center;
          color: #7f8c8d;
        }

        .empty-icon {
          font-size: 3rem;
          color: #bdc3c7;
          margin-bottom: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .mission-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .step-card-modern,
          .feature-card-modern {
            margin-bottom: 2rem;
          }

          /* Expert cards responsive adjustments */
          .expert-card-modern.compact .expert-name {
            font-size: 0.9rem;
          }

          .expert-card-modern.compact .expert-bio {
            font-size: 0.75rem;
          }

          .expert-card-modern.compact .btn-primary-modern {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }

          /* Expert images remain square on tablet */
          .expert-card-modern.compact .expert-image-container {
            aspect-ratio: 1;
          }

          .expert-card-modern.compact .expert-image {
            aspect-ratio: 1;
          }

          /* Podcast cards responsive adjustments */
          .podcast-card-modern.compact .podcast-title {
            font-size: 0.9rem;
          }

          .podcast-card-modern.compact .podcast-description {
            font-size: 0.75rem;
          }

          .podcast-card-modern.compact .btn-primary-modern {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }

          /* Podcast images remain square on tablet */
          .podcast-card-modern.compact .podcast-image-container {
            aspect-ratio: 1;
          }

          .podcast-card-modern.compact .podcast-image {
            aspect-ratio: 1;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-section {
            padding: 4rem 0 2rem;
          }

          .main-content {
            padding: 2rem 0;
          }

          .section-modern {
            margin-bottom: 3rem;
          }

          /* Expert cards mobile adjustments */
          .expert-card-modern.compact {
            padding: 0.5rem;
          }

          .expert-card-modern.compact .expert-card-header {
            padding: 0.5rem;
          }

          .expert-card-modern.compact .expert-image-container {
            margin-bottom: 0.5rem;
            aspect-ratio: 1;
          }

          .expert-card-modern.compact .expert-image {
            aspect-ratio: 1;
            border-radius: 8px;
          }

          .expert-card-modern.compact .expert-name {
            font-size: 0.85rem;
          }

          .expert-card-modern.compact .expert-bio {
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .expert-card-modern.compact .expert-card-actions {
            padding: 0.5rem;
            flex-direction: column;
            gap: 0.4rem;
          }

          .expert-card-modern.compact .btn-primary-modern {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
          }

          .expert-card-modern.compact .btn-like-modern {
            padding: 0.3rem;
            min-width: 35px;
          }

          /* Podcast cards mobile adjustments */
          .podcast-card-modern.compact {
            padding: 0.5rem;
          }

          .podcast-card-modern.compact .podcast-card-header {
            padding: 0.5rem;
          }

          .podcast-card-modern.compact .podcast-image-container {
            margin-bottom: 0.5rem;
            aspect-ratio: 1;
          }

          .podcast-card-modern.compact .podcast-image {
            aspect-ratio: 1;
            border-radius: 8px;
          }

          .podcast-card-modern.compact .podcast-title {
            font-size: 0.85rem;
          }

          .podcast-card-modern.compact .podcast-description {
            font-size: 0.7rem;
            margin-bottom: 0.5rem;
          }

          .podcast-card-modern.compact .podcast-card-actions {
            padding: 0.5rem;
            flex-direction: column;
            gap: 0.4rem;
          }

          .podcast-card-modern.compact .btn-primary-modern {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
          }

          .podcast-card-modern.compact .btn-like-modern {
            padding: 0.3rem;
            min-width: 35px;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .expert-card-modern.compact .expert-image-container {
            aspect-ratio: 1;
            margin-bottom: 0.4rem;
          }

          .expert-card-modern.compact .expert-image {
            aspect-ratio: 1;
            border-radius: 6px;
          }

          .expert-card-modern.compact .expert-name {
            font-size: 0.8rem;
          }

          .expert-card-modern.compact .expert-bio {
            font-size: 0.65rem;
          }

          /* Podcast cards extra small screen adjustments */
          .podcast-card-modern.compact .podcast-image-container {
            aspect-ratio: 1;
            margin-bottom: 0.4rem;
          }

          .podcast-card-modern.compact .podcast-image {
            aspect-ratio: 1;
            border-radius: 6px;
          }

          .podcast-card-modern.compact .podcast-title {
            font-size: 0.8rem;
          }

          .podcast-card-modern.compact .podcast-description {
            font-size: 0.6rem;
          }

          .podcast-card-modern.compact .btn-primary-modern {
            font-size: 0.65rem;
            padding: 0.25rem 0.5rem;
          }

          .podcast-card-modern.compact .btn-like-modern {
            padding: 0.25rem;
            min-width: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
