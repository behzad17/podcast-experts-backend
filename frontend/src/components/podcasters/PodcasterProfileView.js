import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const PodcasterProfileView = () => {
  const { id } = useParams();
  const { getAuthHeaders, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/podcasters/${id}/`,
          getAuthHeaders()
        );
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, getAuthHeaders]);

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-4">
        <Alert variant="warning">Profile not found</Alert>
      </div>
    );
  }

  const isOwner = user && user.id === profile.user;

  return (
    <div className="container py-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h2 className="mb-2">{profile.user_name}</h2>
                  <p className="text-muted mb-0">{profile.expertise}</p>
                </div>
                {isOwner && (
                  <Button
                    as={Link}
                    to={`/podcasters/${id}/edit`}
                    variant="outline-primary"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="mb-4">
                <h5>About</h5>
                <p>{profile.bio}</p>
              </div>

              {profile.website && (
                <div className="mb-4">
                  <h5>Website</h5>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              <div>
                <h5>Social Media</h5>
                <div className="d-flex gap-3">
                  {profile.social_media.twitter && (
                    <a
                      href={`https://twitter.com/${profile.social_media.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <FaTwitter size={24} className="text-primary" />
                    </a>
                  )}
                  {profile.social_media.instagram && (
                    <a
                      href={`https://instagram.com/${profile.social_media.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <FaInstagram size={24} className="text-danger" />
                    </a>
                  )}
                  {profile.social_media.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.social_media.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <FaLinkedin size={24} className="text-primary" />
                    </a>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Podcasts</h5>
              {/* Add podcast list here when available */}
              <p className="text-muted">No podcasts available yet.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PodcasterProfileView;
