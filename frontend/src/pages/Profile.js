import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  ListGroup,
  Image,
} from "react-bootstrap";
import api from "../api/axios";
import ProfileEditModal from "../components/profile/ProfileEditModal";
import {
  FaUser,
  FaGlobe,
  FaShareAlt,
  FaEdit,
  FaMicrophone,
  FaPodcast,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get current user data
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
          setCurrentUser(userData);
        }

        // Fetch profile based on user type
        if (userData?.user_type === "expert") {
          const response = await api.get("/experts/my-profile/");
          setProfile(response.data);
        } else if (userData?.user_type === "podcaster") {
          const response = await api.get("/podcasts/profiles/");
          // Since the ViewSet returns a list, we need to get the first item
          if (response.data && response.data.length > 0) {
            setProfile(response.data[0]);
            // Fetch podcaster's podcasts using the my-podcasts endpoint
            try {
              const podcastsResponse = await api.get("/podcasts/my-podcasts/");
              if (
                podcastsResponse.data &&
                Array.isArray(podcastsResponse.data)
              ) {
                setPodcasts(podcastsResponse.data);
              } else {
                console.error(
                  "Unexpected podcasts response format:",
                  podcastsResponse.data
                );
                setPodcasts([]);
              }
            } catch (podcastError) {
              console.error("Error fetching podcasts:", podcastError);
              setPodcasts([]);
            }
          } else {
            setError(
              "No podcaster profile found. Please create a profile first."
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleEditPodcast = (podcastId) => {
    navigate(`/podcasts/${podcastId}/edit`);
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

  if (!profile) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          No profile found. Please create a profile first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <FaUser className="me-2" />
                My Profile
              </h3>
              <Button variant="primary" onClick={handleEditClick}>
                <FaEdit className="me-2" />
                Edit Profile
              </Button>
            </Card.Header>
            <Card.Body>
              {profile.profile_picture_url && (
                <div className="text-center mb-4">
                  <img
                    src={profile.profile_picture_url}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5 className="mb-2">
                    <FaMicrophone className="me-2" />
                    Channel Information
                  </h5>
                  <div className="ms-4">
                    <p>
                      <strong>Channel Name:</strong>{" "}
                      {profile.channel_name || "Not set"}
                    </p>
                    <p>
                      <strong>Bio:</strong> {profile.bio || "Not set"}
                    </p>
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h5 className="mb-2">
                    <FaGlobe className="me-2" />
                    Contact Information
                  </h5>
                  <div className="ms-4">
                    <p>
                      <strong>Website:</strong>{" "}
                      {profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        "Not set"
                      )}
                    </p>
                  </div>
                </ListGroup.Item>

                {profile.social_links &&
                  Object.keys(profile.social_links).length > 0 && (
                    <ListGroup.Item>
                      <h5 className="mb-2">
                        <FaShareAlt className="me-2" />
                        Social Links
                      </h5>
                      <div className="ms-4">
                        {Object.entries(profile.social_links).map(
                          ([platform, url]) => (
                            <Badge
                              key={platform}
                              bg="secondary"
                              className="me-2 mb-2"
                              style={{
                                fontSize: "0.9rem",
                                padding: "0.5rem 1rem",
                              }}
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white text-decoration-none"
                              >
                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                              </a>
                            </Badge>
                          )
                        )}
                      </div>
                    </ListGroup.Item>
                  )}

                <ListGroup.Item>
                  <h5 className="mb-2">Account Details</h5>
                  <div className="ms-4">
                    <p>
                      <strong>Member Since:</strong>{" "}
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(profile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* My Podcasts Section */}
          {currentUser?.user_type === "podcaster" && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <FaPodcast className="me-2" />
                  My Podcasts
                </h3>
                <Button
                  variant="primary"
                  onClick={() => navigate("/podcasts/create")}
                >
                  <FaEdit className="me-2" />
                  Create New Podcast
                </Button>
              </Card.Header>
              <Card.Body>
                {podcasts.length === 0 ? (
                  <Alert variant="info">
                    You haven't created any podcasts yet. Click the button above
                    to create your first podcast!
                  </Alert>
                ) : (
                  <ListGroup variant="flush">
                    {podcasts.map((podcast) => (
                      <ListGroup.Item key={podcast.id}>
                        <div className="d-flex align-items-center">
                          {podcast.image && (
                            <Image
                              src={podcast.image}
                              alt={podcast.title}
                              rounded
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                marginRight: "1rem",
                              }}
                            />
                          )}
                          <div className="flex-grow-1">
                            <h5 className="mb-1">{podcast.title}</h5>
                            <p className="mb-1 text-muted">
                              {podcast.description}
                            </p>
                            <div className="d-flex align-items-center">
                              <Badge
                                bg={podcast.is_approved ? "success" : "warning"}
                                className="me-2"
                              >
                                {podcast.is_approved ? "Approved" : "Pending"}
                              </Badge>
                              <small className="text-muted me-3">
                                Created:{" "}
                                {new Date(
                                  podcast.created_at
                                ).toLocaleDateString()}
                              </small>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditPodcast(podcast.id)}
                              >
                                <FaEdit className="me-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <ProfileEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        profile={profile}
        onUpdate={handleProfileUpdate}
      />
    </Container>
  );
};

export default Profile;
