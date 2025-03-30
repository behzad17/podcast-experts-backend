import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import LikeButton from "../components/common/LikeButton";

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

  const getExpertImageUrl = (expert) => {
    if (expert.profile_picture) return expert.profile_picture;
    return "/logo192.png";
  };

  const getPodcastImageUrl = (podcast) => {
    if (podcast.image) return podcast.image;
    return "/logo192.png";
  };

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

      {/* Featured Experts Section */}
      <section className="mb-5">
        <h2 className="mb-4">Featured Experts</h2>
        <Row className="g-4">
          {loading ? (
            <Col>Loading...</Col>
          ) : featuredExperts.length > 0 ? (
            featuredExperts.map((expert) => (
              <Col key={expert.id} md={4}>
                <Card className="h-100 shadow-sm rounded-3">
                  <div className="d-flex h-100">
                    <div
                      className="p-3"
                      style={{
                        width: "75%",
                        borderRight: "2px solid #ced4da",
                        backgroundColor: "#F0F8FF",
                      }}
                    >
                      <Card.Title className="h6 mb-2">{expert.name}</Card.Title>
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
            <Col>No featured experts available</Col>
          )}
        </Row>
      </section>

      {/* Featured Podcasts Section */}
      <section className="mb-5">
        <h2 className="mb-4">Featured Podcasts</h2>
        <Row className="g-4">
          {loading ? (
            <Col>Loading...</Col>
          ) : featuredPodcasts.length > 0 ? (
            featuredPodcasts.map((podcast) => (
              <Col key={podcast.id} md={4}>
                <Card className="h-100 shadow-sm rounded-3">
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
                        {podcast.title}
                      </Card.Title>
                      <Card.Text className="small text-muted mb-3">
                        {podcast.description?.substring(0, 10)}...
                      </Card.Text>
                      <div className="d-flex gap-2 align-items-center">
                        <Link
                          to={`/podcasts/${podcast.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Listen Now
                        </Link>
                        <LikeButton
                          itemId={podcast.id}
                          type="podcasts/podcasts"
                          initialCount={podcast.likes_count}
                          className="btn-sm"
                        />
                      </div>
                    </div>
                    <div style={{ width: "25%", minWidth: "25%" }}>
                      <Card.Img
                        src={getPodcastImageUrl(podcast)}
                        alt={podcast.title}
                        style={{ height: "100%", objectFit: "cover" }}
                        className="rounded-end-3"
                      />
                    </div>
                  </div>
                </Card>
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
              <h3 className="h5">Find Experts</h3>
              <p className="small text-muted mb-0">
                Search and connect with industry professionals.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm rounded-3">
            <Card.Body className="p-3">
              <h3 className="h5">Discover Podcasts</h3>
              <p className="small text-muted mb-0">
                Explore and listen to amazing podcasts.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
