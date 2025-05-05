import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { getProfile } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile...");
        const response = await getProfile();
        console.log("Profile response:", response.data);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response || err);
        setError(
          `Failed to fetch profile: ${
            err.response?.data?.detail || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <br />
          <small>Please check the console for more details.</small>
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Profile not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              {profile.profile_picture && (
                <img
                  src={profile.profile_picture}
                  alt={profile.username}
                  className="img-fluid rounded-circle"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}
            </Col>
            <Col md={8}>
              <h2>{profile.username}</h2>
              <p className="text-muted">{profile.email}</p>
              {profile.bio && <p>{profile.bio}</p>}

              <div className="mt-4">
                {profile.user_type === "expert" &&
                  !profile.has_created_expert && (
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => navigate("/experts/create")}
                    >
                      Create Expert Profile
                    </Button>
                  )}
                {profile.user_type === "podcaster" &&
                  !profile.has_created_podcast && (
                    <Button
                      variant="primary"
                      onClick={() => navigate("/podcasts/create")}
                    >
                      Create Podcast
                    </Button>
                  )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
