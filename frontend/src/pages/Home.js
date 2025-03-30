import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [featuredExperts, setFeaturedExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }

    const fetchFeaturedItems = async () => {
      try {
        const [podcastsRes, expertsRes] = await Promise.all([
          axios.get("/podcasts/podcasts/featured/"),
          axios.get("/experts/profiles/featured/"),
        ]);
        setFeaturedPodcasts(podcastsRes.data);
        setFeaturedExperts(expertsRes.data);
      } catch (error) {
        console.error("Error fetching featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome to Podcast Platform</h1>
        {isAuthenticated && (
          <div className="text-muted">
            You are logged in as{" "}
            {userType === "expert" ? "an Expert" : "a Podcaster"}
          </div>
        )}
      </div>

      {/* Featured Podcasts Section */}
      <section className="mb-5">
        <h2 className="mb-4">Featured Podcasts</h2>
        <Row>
          {loading ? (
            <Col>Loading...</Col>
          ) : featuredPodcasts.length > 0 ? (
            featuredPodcasts.map((podcast) => (
              <Col key={podcast.id} md={4} className="mb-4">
                <Card className="h-100">
                  {podcast.image && (
                    <Card.Img
                      variant="top"
                      src={podcast.image}
                      alt={podcast.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{podcast.title}</Card.Title>
                    <Card.Text>{podcast.description}</Card.Text>
                    <Link
                      to={`/podcasts/${podcast.id}`}
                      className="btn btn-primary"
                    >
                      Listen Now
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>No featured podcasts available.</Col>
          )}
        </Row>
      </section>

      {/* Featured Experts Section */}
      <section className="mb-5">
        <h2 className="mb-4">Featured Experts</h2>
        <Row>
          {loading ? (
            <Col>Loading...</Col>
          ) : featuredExperts.length > 0 ? (
            featuredExperts.map((expert) => (
              <Col key={expert.id} md={4} className="mb-4">
                <Card className="h-100">
                  {expert.profile_picture && (
                    <Card.Img
                      variant="top"
                      src={expert.profile_picture}
                      alt={expert.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{expert.name}</Card.Title>
                    <Card.Text>{expert.expertise}</Card.Text>
                    <Link
                      to={`/experts/${expert.id}`}
                      className="btn btn-primary"
                    >
                      View Profile
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>No featured experts available.</Col>
          )}
        </Row>
      </section>

      <Row>
        <Col md={6}>
          <Card className="p-3">
            <h3>Find Experts</h3>
            <p>Search and connect with industry professionals.</p>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h3>Discover Podcasts</h3>
            <p>Explore and listen to amazing podcasts.</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
