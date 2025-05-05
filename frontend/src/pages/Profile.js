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
import { api, getPodcasterProfile, getMyPodcasts } from "../services/api";
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
          try {
            const response = await getPodcasterProfile();
            setProfile(response.data);
            // Fetch podcaster's podcasts
            const podcastsResponse = await getMyPodcasts();
            setPodcasts(podcastsResponse.data);
          } catch (error) {
            if (error.response?.status === 404) {
              setError(
                "No podcaster profile found. Please create a profile first."
              );
            } else {
              setError("Failed to load profile. Please try again later.");
            }
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
        {currentUser?.user_type === "podcaster" && (
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate("/podcasts/profile/create")}
          >
            Create Podcaster Profile
          </Button>
        )}
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          No profile found. Please create a profile first.
        </Alert>
        {currentUser?.user_type === "podcaster" && (
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate("/podcasts/profile/create")}
          >
            Create Podcaster Profile
          </Button>
        )}
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
                {currentUser?.user_type === "expert" &&
                  !profile.has_created_expert && (
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => navigate("/experts/create")}
                    >
                      Create Expert Profile
                    </Button>
                  )}
                {currentUser?.user_type === "podcaster" &&
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

      {/* My Podcasts Section */}
      {currentUser?.user_type === "podcaster" && (
        <Card className="mt-4">
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
                You haven't created any podcasts yet.
              </Alert>
            ) : (
              <ListGroup>
                {podcasts.map((podcast) => (
                  <ListGroup.Item
                    key={podcast.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5>{podcast.title}</h5>
                      <p className="mb-0">{podcast.description}</p>
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEditPodcast(podcast.id)}
                    >
                      <FaEdit /> Edit
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      )}

      {showEditModal && (
        <ProfileEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          profile={profile}
          onUpdate={handleProfileUpdate}
        />
      )}
    </Container>
  );
};

export default Profile;
