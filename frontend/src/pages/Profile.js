import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Profile = () => {
  const [userPodcasts, setUserPodcasts] = useState([]);
  const [userPodcasts2, setUserPodcasts2] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get current user data
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData) {
          setError("Please log in to view your podcasts.");
          setIsLoading(false);
          return;
        }
        setCurrentUser(userData);

        // Fetch user's podcasts
        const [podcastsResponse, podcasts2Response] = await Promise.all([
          api.get("/podcasts/podcasts/"),
          api.get("/podcast2/podcasts2/"),
        ]);

        const userPodcastsList =
          podcastsResponse.data?.results?.filter(
            (podcast) => podcast.user === userData.id
          ) || [];
        setUserPodcasts(userPodcastsList);

        const userPodcasts2List =
          podcasts2Response.data?.results?.filter(
            (podcast) => podcast.user === userData.id
          ) || [];
        setUserPodcasts2(userPodcasts2List);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handleDeletePodcast = async (podcastId, type) => {
    if (window.confirm("Are you sure you want to delete this podcast?")) {
      try {
        const endpoint =
          type === "podcast2"
            ? `/podcast2/podcasts2/${podcastId}/`
            : `/podcasts/podcasts/${podcastId}/`;
        await api.delete(endpoint);

        if (type === "podcast2") {
          setUserPodcasts2((prev) => prev.filter((p) => p.id !== podcastId));
        } else {
          setUserPodcasts((prev) => prev.filter((p) => p.id !== podcastId));
        }
      } catch (error) {
        console.error("Error deleting podcast:", error);
        alert("Failed to delete podcast. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">My Podcasts</h3>
              <Link to="/podcasts/create" className="btn btn-success">
                Create New Podcast
              </Link>
            </Card.Header>
            <Card.Body>
              {userPodcasts.length === 0 ? (
                <Alert variant="info">
                  You haven't created any podcasts yet.
                </Alert>
              ) : (
                <Row>
                  {userPodcasts.map((podcast) => (
                    <Col key={podcast.id} md={6} className="mb-4">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={podcast.cover_image || "/default-podcast.jpg"}
                          alt={podcast.title}
                        />
                        <Card.Body>
                          <Card.Title>{podcast.title}</Card.Title>
                          <Card.Text>{podcast.description}</Card.Text>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/podcasts/${podcast.id}`}
                              className="btn btn-primary"
                            >
                              View
                            </Link>
                            <Link
                              to={`/podcasts/${podcast.id}/edit`}
                              className="btn btn-warning"
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                handleDeletePodcast(podcast.id, "podcast")
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">My Podcast2s</h3>
              <Link to="/podcast2/create" className="btn btn-success">
                Create New Podcast2
              </Link>
            </Card.Header>
            <Card.Body>
              {userPodcasts2.length === 0 ? (
                <Alert variant="info">
                  You haven't created any podcast2s yet.
                </Alert>
              ) : (
                <Row>
                  {userPodcasts2.map((podcast) => (
                    <Col key={podcast.id} md={6} className="mb-4">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={podcast.cover_image || "/default-podcast.jpg"}
                          alt={podcast.title}
                        />
                        <Card.Body>
                          <Card.Title>{podcast.title}</Card.Title>
                          <Card.Text>{podcast.description}</Card.Text>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/podcast2/${podcast.id}`}
                              className="btn btn-primary"
                            >
                              View
                            </Link>
                            <Link
                              to={`/podcast2/${podcast.id}/edit`}
                              className="btn btn-warning"
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                handleDeletePodcast(podcast.id, "podcast2")
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
