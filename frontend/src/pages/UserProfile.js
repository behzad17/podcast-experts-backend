import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [expertProfile, setExpertProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Fetch user data
        const userResponse = await axios.get("http://localhost:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch user's podcasts
        const podcastsResponse = await axios.get(
          "http://localhost:8000/api/podcasts/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPodcasts(podcastsResponse.data.filter(podcast => podcast.owner === userResponse.data.id));

        // Fetch expert profile if user is an expert
        if (localStorage.getItem("userType") === "expert") {
          const expertResponse = await axios.get(
            "http://localhost:8000/api/experts/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const userExpertProfile = expertResponse.data.find(
            expert => expert.user === userResponse.data.id
          );
          setExpertProfile(userExpertProfile);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-4">
        <div>Please log in to view your profile.</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">My Profile</h1>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h3>Account Information</h3>
            </Card.Header>
            <Card.Body>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Account Type:</strong> {localStorage.getItem("userType") === "expert" ? "Expert" : "Podcaster"}</p>
            </Card.Body>
          </Card>

          {localStorage.getItem("userType") === "expert" && expertProfile && (
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h3>Expert Profile</h3>
                <Link to={`/experts/${expertProfile.id}/edit`}>
                  <Button variant="outline-primary">Edit Profile</Button>
                </Link>
              </Card.Header>
              <Card.Body>
                <p><strong>Bio:</strong> {expertProfile.bio}</p>
                <p><strong>Specialization:</strong> {expertProfile.specialization}</p>
                <p><strong>Experience:</strong> {expertProfile.experience} years</p>
                <p><strong>Hourly Rate:</strong> ${expertProfile.hourly_rate}/hour</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3>My Podcasts</h3>
              <Link to="/podcasts/create">
                <Button variant="primary">Create New Podcast</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {podcasts.length === 0 ? (
                <p>You haven't created any podcasts yet.</p>
              ) : (
                <ListGroup>
                  {podcasts.map((podcast) => (
                    <ListGroup.Item key={podcast.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{podcast.title}</h5>
                        <p className="mb-0 text-muted">{podcast.description}</p>
                      </div>
                      <Link to={`/podcasts/${podcast.id}/edit`}>
                        <Button variant="outline-primary" size="sm">Edit</Button>
                      </Link>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile; 