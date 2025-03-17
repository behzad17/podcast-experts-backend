import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PodcastCard from "../components/podcasts/PodcastCard";
import PodcastEditModal from "../components/podcasts/PodcastEditModal";

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
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
    const fetchData = async () => {
      try {
        const [podcastsResponse, token] = await Promise.all([
          api.get("/podcasts/"),
          localStorage.getItem("token"),
        ]);

        setPodcasts(podcastsResponse.data);

        if (token) {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          setCurrentUser(tokenData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          setError("Please log in to view podcasts.");
        } else {
          setError("Failed to load podcasts. Please try again later.");
        }
      }
    };

    fetchData();
  }, []);

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
      setPodcasts(
        podcasts.map((p) =>
          p.id === editingPodcast.id ? { ...p, ...editFormData } : p
        )
      );
    } catch (error) {
      console.error("Error updating podcast:", error);
      setError("Failed to update podcast. Please try again.");
    }
  };

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <PodcastCard
              podcast={podcast}
              currentUser={currentUser}
              onEdit={handleEditClick}
            />
          </Col>
        ))}
      </Row>
      {filteredPodcasts.length === 0 && (
        <Alert variant="info">
          No podcasts found. Try adjusting your search term or create a new
          podcast.
        </Alert>
      )}

      <PodcastEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        podcast={editingPodcast}
        formData={editFormData}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
      />
    </Container>
  );
};

export default Podcasts;
