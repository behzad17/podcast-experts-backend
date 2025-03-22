import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await api.get(`/experts/${id}/`);
        setExpert(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching expert:", err);
        setError("Failed to fetch expert profile");
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this expert profile?")
    ) {
      try {
        await api.delete(`/experts/${id}/`);
        navigate("/experts");
      } catch (err) {
        console.error("Error deleting expert:", err);
        setError("Failed to delete expert profile");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!expert) return <Alert variant="info">Expert profile not found</Alert>;

  const isOwner = user && expert.user === user.id;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            {expert.profile_image && (
              <Card.Img
                variant="top"
                src={expert.profile_image}
                alt={expert.name}
                style={{ height: "300px", objectFit: "cover" }}
              />
            )}
            <Card.Body>
              <Card.Title className="h2">{expert.name}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                {expert.expertise}
              </Card.Subtitle>
              <Card.Text>
                <strong>Experience:</strong> {expert.experience_years} years
              </Card.Text>
              <Card.Text>{expert.bio}</Card.Text>

              {expert.website && (
                <Card.Link
                  href={expert.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block mb-2"
                >
                  Website
                </Card.Link>
              )}

              {expert.social_media && (
                <Card.Link
                  href={`https://${expert.social_media}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block mb-3"
                >
                  Social Media
                </Card.Link>
              )}

              {isOwner && (
                <div className="d-flex gap-2 mt-3">
                  <Link to={`/experts/${id}/edit`}>
                    <Button variant="warning">Edit Profile</Button>
                  </Link>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Profile
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpertDetail;
