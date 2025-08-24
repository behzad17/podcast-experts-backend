import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import LikeButton from "../components/common/LikeButton";
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
    // Check if we have a profile picture URL (Cloudinary URL)
    if (
      expert.profile_picture_url &&
      expert.profile_picture_url.startsWith("http")
    ) {
      return expert.profile_picture_url;
    }

    // Check if we have a profile picture field (Cloudinary URL)
    if (expert.profile_picture && expert.profile_picture.startsWith("http")) {
      return expert.profile_picture;
    }

    return "/logo192.png";
  };

  const getPodcastImageUrl = (podcast) => {
    // Check if we have an image (Cloudinary URL)
    if (podcast.image && podcast.image.startsWith("http")) {
      return podcast.image;
    }
    return "/logo192.png";
  };

  if (authLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f8f9fa, #e3f2fd)",
        backgroundAttachment: "fixed",
        margin: 0,
        padding: 0,
      }}
    >
      <Container className="py-4">
        <h3
          className="mb-4 text-center"
          style={{ color: "#000000", fontSize: "1.5rem", fontWeight: "500" }}
        >
          Welcome to Sweden's podcast and expert connection platform
        </h3>
        <div className="d-flex flex-column align-items-center mb-4">
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "400",
              color: "#6495ED",
              border: "2px solid #6495ED",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              width: "100%",
              margin: "0 auto",
            }}
          >
            This platform provides a convenient and reliable way for experts and
            specialists to connect with podcasters and content creators
          </h3>
          {user && (
            <div
              className="text-muted mt-3"
              style={{
                fontSize: "1.1rem",
                fontWeight: "500",
                color: "#6495ED",
              }}
            >
              You are logged in as{" "}
              {user.user_type === "expert" ? "an Expert" : "a Podcaster"}
            </div>
          )}
        </div>

        {/* Featured Experts Section */}
        <section className="mb-5">
          <h2 className="section-title mb-4">Expert Spotlights</h2>
          <Row className="g-4">
            {loading ? (
              <Col>Loading...</Col>
            ) : featuredExperts.length > 0 ? (
              featuredExperts.map((expert) => (
                <Col key={expert.id} md={4}>
                  <Card className="h-100 shadow-lg rounded-3 expert-card">
                    <div className="d-flex h-100">
                      <div
                        className="p-3"
                        style={{
                          width: "75%",
                          borderRight: "2px solid #ced4da",
                          backgroundColor: "#F0F8FF",
                        }}
                      >
                        <Card.Title className="h6 mb-2">
                          {expert.name}
                        </Card.Title>
                        <Card.Text className="small text-muted mb-2">
                          {expert.bio?.substring(0, 10)}...
                        </Card.Text>
                        <div className="d-flex gap-2 align-items-center">
                          <Link
                            to={`/experts/${expert.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View Profile
                          </Link>
                          <LikeButton
                            itemId={expert.id}
                            type="experts/profiles"
                            initialCount={expert.likes_count}
                            className="btn-sm"
                          />
                        </div>
                      </div>
                      <div style={{ width: "25%", minWidth: "25%" }}>
                        <Card.Img
                          src={getExpertImage(expert)}
                          alt={expert.name}
                          style={{ height: "100%", objectFit: "cover" }}
                          className="rounded-end-3"
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>No featured experts available</Col>
            )}
          </Row>
        </section>

        {/* Featured Podcasts Section */}
        <section className="mb-5">
          <h2 className="section-title mb-4">Great and Engaging Podcasts</h2>
          <Row className="g-4">
            {loading ? (
              <Col>Loading...</Col>
            ) : featuredPodcasts.length > 0 ? (
              featuredPodcasts.map((podcast) => (
                <Col key={podcast.id} xs={12} sm={6} md={4} lg={2}>
                  <div className="podcast-card">
                    <Card className="h-100 shadow-sm">
                      <Card.Img
                        src={getPodcastImageUrl(podcast)}
                        alt={podcast.title}
                        style={{ height: "200px", objectFit: "cover" }}
                        className="rounded-top-3"
                      />
                      <Card.Body
                        className="p-3"
                        style={{ backgroundColor: "#DCE2E8" }}
                      >
                        <Card.Title className="h6 mb-2 text-truncate">
                          {podcast.title}
                        </Card.Title>
                        <Card.Text className="small text-muted mb-3">
                          {podcast.description?.substring(0, 30)}...
                        </Card.Text>
                        <div className="d-flex flex-column gap-2">
                          <Link
                            to={`/podcasts/${podcast.id}`}
                            className="btn btn-sm btn-primary w-100"
                          >
                            Listen Now
                          </Link>
                          <LikeButton
                            itemId={podcast.id}
                            type="podcasts"
                            initialCount={podcast.likes_count}
                            className="btn-sm w-100"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <Col>No featured podcasts available</Col>
            )}
          </Row>
        </section>

        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow-sm rounded-3">
              <Card.Body className="p-3">
                <h3 className="h5">Experts:</h3>
                <p className="small text-muted mb-0">
                  Get booked on podcasts to expand your reach and audience. Join
                  the free newsletter featuring 20 podcasts looking for guests
                  each week. And join our paid expert directory so podcasts can
                  find you.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm rounded-3">
              <Card.Body className="p-3">
                <h3 className="h5">Podcasts:</h3>
                <p className="small text-muted mb-0">
                  Find experts to be guests on your podcast, from our Guest
                  Directory and/or a free podcast feature in our newsletter that
                  goes to many experts and podcasters, that goes to many experts
                  and podcasters.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Our Mission Section */}
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

        <Footer />
      </Container>
    </div>
  );
};

export default Home;
