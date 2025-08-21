import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Badge, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaEye, FaClock, FaCheckCircle } from "react-icons/fa";
import api from "../api/axios";
import { toast } from "react-toastify";

const PodcasterProfile = () => {
  const [podcasterProfile, setPodcasterProfile] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [podcastToDelete, setPodcastToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPodcasterData();
  }, []);

  const fetchPodcasterData = async () => {
    try {
      setLoading(true);
      // Fetch podcaster profile
      const profileResponse = await api.get("/podcasts/profiles/my_profile/");
      setPodcasterProfile(profileResponse.data);

      // Fetch user's podcasts
      const podcastsResponse = await api.get("/podcasts/");
      const userPodcasts = podcastsResponse.data.filter(
        podcast => podcast.owner?.user === profileResponse.data.user
      );
      setPodcasts(userPodcasts);
    } catch (error) {
      console.error("Error fetching podcaster data:", error);
      if (error.response?.status === 404) {
        setError("Podcaster profile not found. Please create one first.");
      } else {
        setError("Failed to load podcaster profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePodcast = async () => {
    if (!podcastToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/podcasts/${podcastToDelete.id}/`);
      setPodcasts(podcasts.filter(p => p.id !== podcastToDelete.id));
      toast.success("Podcast deleted successfully");
      setShowDeleteModal(false);
      setPodcastToDelete(null);
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error("Failed to delete podcast");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (podcast) => {
    setPodcastToDelete(podcast);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return <Badge bg="success"><FaCheckCircle className="me-1" />Approved</Badge>;
    } else {
      return <Badge bg="warning"><FaClock className="me-1" />Pending Approval</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          {error.includes("not found") && (
            <div className="mt-3">
              <Link to="/podcasts/profile/create" className="btn btn-primary">
                Create Podcaster Profile
              </Link>
            </div>
          )}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Podcaster Profile Header */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          <Row>
            <Col md={8}>
              <h2 className="mb-3">Podcaster Profile</h2>
              <div className="mb-3">
                <strong>Username:</strong> {podcasterProfile?.user?.username}
              </div>
              {podcasterProfile?.bio && (
                <div className="mb-3">
                  <strong>Bio:</strong> {podcasterProfile.bio}
                </div>
              )}
              {podcasterProfile?.website && (
                <div className="mb-3">
                  <strong>Website:</strong>{" "}
                  <a href={podcasterProfile.website} target="_blank" rel="noopener noreferrer">
                    {podcasterProfile.website}
                  </a>
                </div>
              )}
            </Col>
            <Col md={4} className="text-end">
              <Link to="/podcasts/create" className="btn btn-primary mb-2">
                <FaPlus className="me-2" />
                Create New Podcast
              </Link>
              <br />
              <Link to="/podcasts/profile/edit" className="btn btn-outline-secondary">
                <FaEdit className="me-2" />
                Edit Profile
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Podcasts Section */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h4 className="mb-0">My Podcasts ({podcasts.length})</h4>
        </Card.Header>
        <Card.Body>
          {podcasts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-3">You haven't created any podcasts yet.</p>
              <Link to="/podcasts/create" className="btn btn-primary">
                <FaPlus className="me-2" />
                Create Your First Podcast
              </Link>
            </div>
          ) : (
            <Row>
              {podcasts.map((podcast) => (
                <Col key={podcast.id} lg={6} className="mb-3">
                  <Card className="h-100 podcast-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{podcast.title}</h6>
                        {getStatusBadge(podcast.is_approved)}
                      </div>
                      
                      <p className="card-text text-muted small mb-2">
                        {podcast.description?.length > 100 
                          ? `${podcast.description.substring(0, 100)}...` 
                          : podcast.description}
                      </p>
                      
                      <div className="mb-2">
                        {podcast.category && (
                          <Badge bg="info" className="me-2">
                            {podcast.category.name}
                          </Badge>
                        )}
                        <small className="text-muted">
                          Created: {new Date(podcast.created_at).toLocaleDateString()}
                        </small>
                      </div>

                      <div className="d-flex gap-2 flex-wrap">
                        <Link 
                          to={`/podcasts/${podcast.id}`} 
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FaEye className="me-1" />
                          View
                        </Link>
                        
                        <Link 
                          to={`/podcasts/${podcast.id}/edit`} 
                          className="btn btn-outline-warning btn-sm"
                        >
                          <FaEdit className="me-1" />
                          Edit
                        </Link>
                        
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => confirmDelete(podcast)}
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{podcastToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeletePodcast}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PodcasterProfile;
