import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import ProfileEditModal from "../components/profile/ProfileEditModal";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
          const response = await api.get("/experts/my_profile/");
          setProfile(response.data);
        } else if (userData?.user_type === "podcaster") {
          const response = await api.get("/podcasts/profile/");
          setProfile(response.data);
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
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">My Profile</h3>
              <Button variant="primary" onClick={handleEditClick}>
                Edit Profile
              </Button>
            </Card.Header>
            <Card.Body>
              {profile.profile_picture && (
                <div className="text-center mb-4">
                  <img
                    src={profile.profile_picture}
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

              <div className="mb-3">
                <h5>Name</h5>
                <p>{profile.name || "Not set"}</p>
              </div>

              <div className="mb-3">
                <h5>Bio</h5>
                <p>{profile.bio || "Not set"}</p>
              </div>

              {currentUser?.user_type === "expert" && (
                <>
                  <div className="mb-3">
                    <h5>Expertise</h5>
                    <p>{profile.expertise || "Not set"}</p>
                  </div>

                  <div className="mb-3">
                    <h5>Years of Experience</h5>
                    <p>{profile.experience_years || "Not set"}</p>
                  </div>

                  <div className="mb-3">
                    <h5>Website</h5>
                    <p>
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

                  <div className="mb-3">
                    <h5>Social Media</h5>
                    <p>{profile.social_media || "Not set"}</p>
                  </div>
                </>
              )}

              {currentUser?.user_type === "podcaster" && (
                <>
                  <div className="mb-3">
                    <h5>Website</h5>
                    <p>
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

                  <div className="mb-3">
                    <h5>Social Links</h5>
                    <pre>
                      {JSON.stringify(profile.social_links, null, 2) ||
                        "Not set"}
                    </pre>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
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
