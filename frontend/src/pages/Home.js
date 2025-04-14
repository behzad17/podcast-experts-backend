import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import LikeButton from "../components/common/LikeButton";
import Footer from "../components/common/Footer";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [featuredExperts, setFeaturedExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }

    const fetchFeaturedItems = async () => {
      try {
        setError(null);
        const response = await axios.get("/");
        setFeaturedPodcasts(response.data.featured_podcasts);
        setFeaturedExperts(response.data.featured_experts);
      } catch (error) {
        console.error("Error fetching featured items:", error);
        setError("Failed to load featured items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const getExpertImageUrl = (expert) => {
    if (expert.profile_picture_url) return expert.profile_picture_url;
    return "/logo192.png";
  };

  const getPodcastImageUrl = (podcast) => {
    if (podcast.image_url) return podcast.image_url;
    return "/logo192.png";
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
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
          style={{ color: "#6495ED", fontSize: "1.5rem", fontWeight: "500" }}
        >
          Welcome to Podcast Experts
        </h3>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3
            style={{ fontSize: "1.5rem", fontWeight: "500", color: "#6495ED" }}
          >
            This platform provides a convenient and reliable way for experts and
            specialists to connect with podcasters and content creators
          </h3>
          {isAuthenticated && (
            <div className="text-muted">
              You are logged in as{" "}
              {userType === "expert" ? "an Expert" : "a Podcaster"}
            </div>
          )}
        </div>

        {/* Featured Experts Section */}
        <section className="mb-5">
          <h2 className="mb-4 text-center">Featured Experts</h2>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row className="g-4">
              {featuredExperts.length > 0 ? (
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
                            {expert.bio?.substring(0, 100)}...
                          </Card.Text>
                          <div className="d-flex gap-2 align-items-center">
                            <Link
                              to={`/experts/${expert.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                        <div style={{ width: "25%", minWidth: "25%" }}>
                          <Card.Img
                            src={getExpertImageUrl(expert)}
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
                <Col>
                  <Alert variant="info">No featured experts available</Alert>
                </Col>
              )}
            </Row>
          )}
        </section>

        {/* Featured Podcasts Section */}
        <section className="mb-5">
          <h2 className="mb-4 text-center">Featured Podcasts</h2>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row className="g-4">
              {featuredPodcasts.length > 0 ? (
                featuredPodcasts.map((podcast) => (
                  <Col key={podcast.id} xs={12} sm={6} md={4} lg={3}>
                    <Card className="h-100 shadow-sm">
                      <Card.Img
                        src={getPodcastImageUrl(podcast)}
                        alt={podcast.title}
                        style={{ height: "200px", objectFit: "cover" }}
                        className="rounded-top-3"
                      />
                      <Card.Body
                        className="p-3"
                        style={{ backgroundColor: "#F0F8FF" }}
                      >
                        <Card.Title className="h6 mb-2 text-truncate">
                          {podcast.title}
                        </Card.Title>
                        <Card.Text className="small text-muted mb-3">
                          {podcast.description?.substring(0, 100)}...
                        </Card.Text>
                        <div className="d-flex flex-column gap-2">
                          <Link
                            to={`/podcasts/${podcast.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            View Details
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <Alert variant="info">No featured podcasts available</Alert>
                </Col>
              )}
            </Row>
          )}
        </section>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
