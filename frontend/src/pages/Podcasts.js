import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  Button,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPodcasts();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      // Decode the JWT token to get user information
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      console.log("Token data:", tokenData);
      setCurrentUser(tokenData);
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/podcasts/");
      console.log("Fetched podcasts:", response.data);
      setPodcasts(response.data);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      if (error.response?.status === 401) {
        setError("Please log in to view podcasts.");
      } else {
        setError("Failed to load podcasts. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePodcast = () => {
    navigate("/podcasts/create");
  };

  const handleEditClick = (podcast) => {
    setEditingPodcast(podcast);
    setEditFormData({
      title: podcast.title,
      description: podcast.description,
      link: podcast.link || "",
      image: null,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length > 0) {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach((key) => {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      });

      await api.patch(`/podcasts/${editingPodcast.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowEditModal(false);
      fetchPodcasts(); // Refresh the podcasts list
    } catch (error) {
      console.error("Error updating podcast:", error);
      setError("Failed to update podcast. Please try again.");
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="mt-4">
        <h2>Loading podcasts...</h2>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Podcasts</h2>
        <Button variant="primary" onClick={handleCreatePodcast}>
          Create Podcast
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by podcast name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <Row>
        {filteredPodcasts.map((podcast) => (
          <Col key={podcast.id} md={4} className="mb-3">
            <Card>
              {podcast.image && (
                <Card.Img
                  variant="top"
                  src={podcast.image}
                  alt={podcast.title}
                />
              )}
              <Card.Body>
                <Card.Title>{podcast.title}</Card.Title>
                <Card.Text>{podcast.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    By {podcast.owner?.channel_name || "Unknown"}
                  </small>
                  <div>
                    {podcast.link && (
                      <a
                        href={podcast.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary me-2"
                      >
                        Listen
                      </a>
                    )}
                    {console.log("Podcast owner:", podcast.owner)}
                    {console.log("Current user:", currentUser)}
                    {console.log("Comparison:", {
                      podcastOwnerId: podcast.owner?.user,
                      currentUserId: currentUser?.user_id,
                      isMatch: podcast.owner?.user === currentUser?.user_id,
                    })}
                    {currentUser &&
                      podcast.owner?.user === currentUser.user_id && (
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(podcast)}
                        >
                          Edit
                        </Button>
                      )}
                  </div>
                </div>
                {!podcast.is_approved && (
                  <Alert variant="warning" className="mt-2 mb-0">
                    Pending approval
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {filteredPodcasts.length === 0 && (
        <Alert variant="info">
          No podcasts found. Try adjusting your search term or create a new
          podcast.
        </Alert>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Podcast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="url"
                name="link"
                value={editFormData.link}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleEditChange}
                accept="image/*"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Podcasts;
