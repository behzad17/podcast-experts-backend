import React from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { getFeaturedPodcasts, getFeaturedExperts } from "../services/api";
import PodcastCard from "./podcasts/PodcastCard";
import ExpertCard from "./experts/ExpertCard";

const Home = () => {
  const { data: userData } = useQuery("userData", () => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const {
    data: featuredPodcasts = [],
    isLoading: podcastsLoading,
    error: podcastsError,
    isError: podcastsIsError,
  } = useQuery("featuredPodcasts", getFeaturedPodcasts, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
    onError: (error) => {
      console.error("Error fetching featured podcasts:", error);
    },
  });

  const {
    data: featuredExperts = [],
    isLoading: expertsLoading,
    error: expertsError,
    isError: expertsIsError,
  } = useQuery("featuredExperts", getFeaturedExperts, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
    onError: (error) => {
      console.error("Error fetching featured experts:", error);
    },
  });

  const renderWelcomeMessage = () => {
    if (!userData) return null;

    const role = userData.user_type === "podcaster" ? "Podcaster" : "Expert";
    return (
      <Alert variant="info" className="mt-4">
        Welcome, {userData.username}! You are logged in as a {role}.
      </Alert>
    );
  };

  if (podcastsLoading || expertsLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  const renderError = (error, message) => {
    if (!error) return null;
    return (
      <Alert variant="danger" className="mt-4">
        {error?.response?.data?.detail || message}
      </Alert>
    );
  };

  return (
    <Container className="mt-4">
      {renderWelcomeMessage()}

      {renderError(podcastsError, "Failed to load featured podcasts")}
      <h2 className="mb-4">Featured Podcasts</h2>
      {!podcastsIsError && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {featuredPodcasts.map((podcast) => (
            <Col key={podcast.id}>
              <PodcastCard podcast={podcast} />
            </Col>
          ))}
        </Row>
      )}

      {renderError(expertsError, "Failed to load featured experts")}
      <h2 className="mt-5 mb-4">Featured Experts</h2>
      {!expertsIsError && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {featuredExperts.map((expert) => (
            <Col key={expert.id}>
              <ExpertCard expert={expert} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
