import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import LikeButton from "../components/common/LikeButton";
import Footer from "../components/common/Footer";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [featuredPodcasts, setFeaturedPodcasts] = useState([]);
  const [featuredExperts, setFeaturedExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const [podcastsRes, expertsRes] = await Promise.allSettled([
          axios.get("/podcasts/podcasts/featured/"),
          axios.get("/experts/profiles/featured/"),
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

  const getExpertImageUrl = (expert) => {
    if (expert.profile_picture) return expert.profile_picture;
    return "/logo192.png";
  };

  const getPodcastImageUrl = (podcast) => {
    if (podcast.image) return podcast.image;
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
          style={{ color: "#6495ED", fontSize: "1.5rem", fontWeight: "500" }}
        >
          Welcome to Swedish Podcast Experts
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
                        style={{ backgroundColor: "#F0F8FF" }}
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
                            type="podcasts/podcasts"
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
                <h3 className="h5">Find Experts</h3>
                <p className="small text-muted mb-0">
                  Get booked on podcasts to expand your reach and audience. Join
                  the free newsletter featuring 20 podcasts looking for guests
                  each week. And join our paid expert directory so podcasts can
                  find you. Get booked on podcasts to expand your reach and
                  audience. Join the free newsletter featuring 20 podcasts
                  looking for guests each week. And join our paid expert
                  directory so podcasts can find you. Get booked on podcasts to
                  expand your reach and audience. Join the free newsletter
                  featuring 20 podcasts looking for guests each week. And join
                  our paid expert directory so podcasts can find you. Get booked
                  on podcasts to expand your reach and audience. Join the free
                  newsletter featuring 20 podcasts looking for guests each week.
                  And join our paid expert directory so podcasts can find you.
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
                <h3 className="h5">Discover Podcasts</h3>
                <p className="small text-muted mb-0">
                  Find experts to be guests on your podcast, from our Guest
                  Directory and/or a free podcast feature in our newsletter that
                  goes to many experts and podcasters, that goes to many experts
                  and podcasters. Find experts to be guests on your podcast,
                  from our Guest Directory and/or a free podcast feature in our
                  newsletter that goes to many experts and podcasters, that goes
                  to many experts and podcasters. Find experts to be guests on
                  your podcast, from our Guest Directory and/or a free podcast
                  feature in our newsletter that goes to many experts and
                  podcasters, that goes to many experts and podcasters. Find
                  experts to be guests on your podcast, from our Guest Directory
                  and/or a free podcast feature in our newsletter that goes to
                  many experts and podcasters, that goes to many experts and
                  podcasters. Find experts to be guests on your podcast, from
                  our Guest Directory and/or a free podcast feature in our
                  newsletter that goes to many experts and podcasters, that goes
                  to many experts and podcasters.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Footer />
      </Container>
    </div>
  );
};

export default Home;
